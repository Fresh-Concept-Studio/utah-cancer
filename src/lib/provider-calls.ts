import type {ContentLink} from './types'

export interface ProviderClinic {
  name: string
  actions: ContentLink[]
}

export interface ClinicCall {
  name: string
  href: string
  phone: string
}

export function clinicCall(clinic: ProviderClinic): ClinicCall | undefined {
  const link = clinic.actions.find((action) => /^tel:\+?\d+$/.test(action.attrs.href))
  if (!link) return undefined
  const digits = link.attrs.href.replace(/\D/g, '')
  const phone = digits.length === 10
    ? `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    : link.html.replace(/<[^>]+>/g, '').trim()
  return {name: clinic.name, href: link.attrs.href, phone}
}

export function providerCalls(clinics: ProviderClinic[]): ClinicCall[] {
  const calls = clinics.map(clinicCall).filter((call): call is ClinicCall => Boolean(call))
  return calls.filter((call, index) => calls.findIndex((other) => other.href === call.href) === index)
}
