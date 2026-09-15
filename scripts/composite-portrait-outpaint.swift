import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation
import Vision

private enum CompositeError: Error, CustomStringConvertible {
    case cannotLoad(URL)
    case noFace(URL)

    var description: String {
        switch self {
        case .cannotLoad(let url): return "Could not load image: \(url.path)"
        case .noFace(let url): return "Could not find a face in: \(url.path)"
        }
    }
}

private let context = CIContext(options: [.cacheIntermediates: false])

private func load(_ url: URL) throws -> CIImage {
    guard let image = CIImage(contentsOf: url, options: [.applyOrientationProperty: true]) else {
        throw CompositeError.cannotLoad(url)
    }
    return image
}

private func largestFace(in image: CIImage, source: URL) throws -> CGRect {
    let request = VNDetectFaceRectanglesRequest()
    let handler = VNImageRequestHandler(ciImage: image)
    try handler.perform([request])

    guard let face = request.results?.max(by: {
        $0.boundingBox.width * $0.boundingBox.height < $1.boundingBox.width * $1.boundingBox.height
    }) else {
        throw CompositeError.noFace(source)
    }

    return CGRect(
        x: image.extent.minX + face.boundingBox.minX * image.extent.width,
        y: image.extent.minY + face.boundingBox.minY * image.extent.height,
        width: face.boundingBox.width * image.extent.width,
        height: face.boundingBox.height * image.extent.height
    )
}

private func smoothGradient(
    from start: CGPoint,
    to end: CGPoint,
    color0: CIColor,
    color1: CIColor,
    extent: CGRect
) -> CIImage {
    let filter = CIFilter.smoothLinearGradient()
    filter.point0 = start
    filter.point1 = end
    filter.color0 = color0
    filter.color1 = color1
    return filter.outputImage!.cropped(to: extent)
}

guard CommandLine.arguments.count == 4 || CommandLine.arguments.count == 5 else {
    FileHandle.standardError.write(
        Data("Usage: composite-portrait-outpaint <original-cutout> <ai-cutout> <output-png> [leader|provider]\n".utf8)
    )
    exit(64)
}

let originalURL = URL(fileURLWithPath: CommandLine.arguments[1]).standardizedFileURL
let aiURL = URL(fileURLWithPath: CommandLine.arguments[2]).standardizedFileURL
let outputURL = URL(fileURLWithPath: CommandLine.arguments[3]).standardizedFileURL
let mode = CommandLine.arguments.count == 5 ? CommandLine.arguments[4] : "leader"

let original = try load(originalURL)
let ai = try load(aiURL)
let originalFace = try largestFace(in: original, source: originalURL)
let aiFace = try largestFace(in: ai, source: aiURL)

// The final 3:4 canvas adds real breathing room around the source portrait.
// Original pixels are kept at 1:1 scale; GPT Image only supplies new pixels in
// the newly exposed clothing/body area around the old crop.
let canvas = mode == "provider"
    ? CGRect(x: 0, y: 0, width: 1000, height: original.extent.height)
    : CGRect(x: 0, y: 0, width: 900, height: original.extent.height + 40)
let originalOffset = CGPoint(
    x: (canvas.width - original.extent.width) / 2,
    y: 0
)
let placedOriginal = original.transformed(by: CGAffineTransform(
    translationX: originalOffset.x,
    y: originalOffset.y
))

let targetFaceCenter = CGPoint(
    x: originalFace.midX + originalOffset.x,
    y: originalFace.midY + originalOffset.y
)
let aiScale = originalFace.width / aiFace.width
let aiOffset = CGPoint(
    x: targetFaceCenter.x - aiFace.midX * aiScale,
    y: targetFaceCenter.y - aiFace.midY * aiScale
)
let transparentCanvas = CIImage(color: .clear).cropped(to: canvas)
let transformedAI = ai
    .transformed(by: CGAffineTransform(scaleX: aiScale, y: aiScale))
    .transformed(by: CGAffineTransform(translationX: aiOffset.x, y: aiOffset.y))
    .cropped(to: canvas)
let placedAI = transformedAI.applyingFilter("CISourceOverCompositing", parameters: [
    kCIInputBackgroundImageKey: transparentCanvas,
]).cropped(to: canvas)

// Feather only the old rectangular crop edges so the original photo blends
// into the AI-completed sleeves. The face and central portrait stay untouched.
let black = CIColor(red: 0, green: 0, blue: 0, alpha: 1)
let white = CIColor(red: 1, green: 1, blue: 1, alpha: 1)
let left = smoothGradient(
    from: CGPoint(x: originalOffset.x, y: 0),
    to: CGPoint(x: originalOffset.x + 10, y: 0),
    color0: black,
    color1: white,
    extent: canvas
)
let right = smoothGradient(
    from: CGPoint(x: originalOffset.x + original.extent.width, y: 0),
    to: CGPoint(x: originalOffset.x + original.extent.width - 10, y: 0),
    color0: black,
    color1: white,
    extent: canvas
)
let bottom = smoothGradient(
    from: CGPoint(x: 0, y: originalOffset.y),
    to: CGPoint(x: 0, y: originalOffset.y + 12),
    color0: black,
    color1: white,
    extent: canvas
)
let sideMask = left.applyingFilter("CIMinimumCompositing", parameters: [
    kCIInputBackgroundImageKey: right,
])
let edgeMask = sideMask.applyingFilter("CIMinimumCompositing", parameters: [
    kCIInputBackgroundImageKey: bottom,
])
let composite = placedOriginal.applyingFilter("CIBlendWithMask", parameters: [
    kCIInputBackgroundImageKey: placedAI,
    kCIInputMaskImageKey: edgeMask,
]).cropped(to: canvas)

try FileManager.default.createDirectory(
    at: outputURL.deletingLastPathComponent(),
    withIntermediateDirectories: true
)
try context.writePNGRepresentation(
    of: composite,
    to: outputURL,
    format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
    options: [:]
)
print("Created \(outputURL.path)")
