import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation
import UniformTypeIdentifiers
import Vision

private enum PortraitError: Error, CustomStringConvertible {
    case cannotLoad(URL)
    case noMask(URL)

    var description: String {
        switch self {
        case .cannotLoad(let url):
            return "Could not load image: \(url.path)"
        case .noMask(let url):
            return "Vision did not return a person mask for: \(url.path)"
        }
    }
}

private let context = CIContext(options: [.cacheIntermediates: false])

private func removeBackground(from inputURL: URL, writingTo outputURL: URL) throws {
    guard let inputImage = CIImage(
        contentsOf: inputURL,
        options: [.applyOrientationProperty: true]
    ) else {
        throw PortraitError.cannotLoad(inputURL)
    }

    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .accurate
    request.outputPixelFormat = kCVPixelFormatType_OneComponent8

    let handler = VNImageRequestHandler(ciImage: inputImage)
    try handler.perform([request])

    guard let observation = request.results?.first else {
        throw PortraitError.noMask(inputURL)
    }

    let rawMask = CIImage(cvPixelBuffer: observation.pixelBuffer)
    let scale = CGAffineTransform(
        scaleX: inputImage.extent.width / rawMask.extent.width,
        y: inputImage.extent.height / rawMask.extent.height
    )
    let edgeScale = max(inputImage.extent.width, inputImage.extent.height) / 1000
    let mask = rawMask
        .transformed(by: scale)
        .cropped(to: inputImage.extent)
        .applyingFilter(
            "CIMorphologyMinimum",
            parameters: [kCIInputRadiusKey: max(0.65, edgeScale * 0.85)]
        )
        .applyingFilter(
            "CIGaussianBlur",
            parameters: [kCIInputRadiusKey: max(0.4, edgeScale * 0.35)]
        )
        .applyingFilter(
            "CIColorControls",
            parameters: [kCIInputContrastKey: 2.0]
        )
        .cropped(to: inputImage.extent)

    let transparent = CIImage(color: .clear).cropped(to: inputImage.extent)
    let cutout = inputImage.applyingFilter(
        "CIBlendWithMask",
        parameters: [
            kCIInputBackgroundImageKey: transparent,
            kCIInputMaskImageKey: mask,
        ]
    )

    try FileManager.default.createDirectory(
        at: outputURL.deletingLastPathComponent(),
        withIntermediateDirectories: true
    )
    try context.writePNGRepresentation(
        of: cutout,
        to: outputURL,
        format: .RGBA8,
        colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
        options: [:]
    )
}

guard CommandLine.arguments.count == 3 else {
    FileHandle.standardError.write(
        Data("Usage: remove-portrait-backgrounds <input-directory-or-file> <output-directory>\n".utf8)
    )
    exit(64)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1]).standardizedFileURL
let outputDirectory = URL(fileURLWithPath: CommandLine.arguments[2]).standardizedFileURL
let fileManager = FileManager.default

let inputs: [URL]
var isDirectory: ObjCBool = false
if fileManager.fileExists(atPath: inputURL.path, isDirectory: &isDirectory), isDirectory.boolValue {
    inputs = try fileManager.contentsOfDirectory(
        at: inputURL,
        includingPropertiesForKeys: nil,
        options: [.skipsHiddenFiles]
    )
    .filter { $0.lastPathComponent.hasPrefix("provider-") && ["jpg", "jpeg", "png"].contains($0.pathExtension.lowercased()) }
    .sorted { $0.lastPathComponent < $1.lastPathComponent }
} else {
    inputs = [inputURL]
}

for input in inputs {
    let output = outputDirectory
        .appendingPathComponent(input.deletingPathExtension().lastPathComponent)
        .appendingPathExtension("png")
    try removeBackground(from: input, writingTo: output)
    print("Created \(output.path)")
}
