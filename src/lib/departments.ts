/** Clinics where Medical and Radiation Oncology keep their own address, phone, fax, and hours. */
export interface ClinicDepartment {
  name: string
  location?: string
  street: string
  city: string
  phone?: string
  fax?: string
  hours?: Partial<Record<DayKey, string>>
}

export const DAYS = [['monday', 'Monday'], ['tuesday', 'Tuesday'], ['wednesday', 'Wednesday'], ['thursday', 'Thursday'], ['friday', 'Friday'], ['saturday', 'Saturday'], ['sunday', 'Sunday']] as const
export type DayKey = typeof DAYS[number][0]

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const hasHours = (department: ClinicDepartment) => DAYS.some(([day]) => department.hours?.[day]?.trim())

/** One hours list per department. A blank day shows as Closed. */
export function departmentHoursHtml(departments: ClinicDepartment[]): string {
  return departments.filter(hasHours).map(department => `<h3 class="loc-hours-dept">${escape(department.name)}</h3><ul class="loc-hours-list">${DAYS.map(([day, label]) => {
    const value = department.hours?.[day]?.trim()
    return value ? `<li><span>${label}</span><span>${escape(value)}</span></li>` : `<li><span>${label}</span><span class="loc-hours-closed">Closed</span></li>`
  }).join('')}</ul>`).join('')
}

/** Clinic-wide sidebar cards minus the single Address and Contact cards, which the department cards replace. */
export function sidebarWithoutContact(html = ''): string {
  return html.split(/(?=<div class="sidebar-card[\s"])/)
    .filter(card => !/class="sidebar-card-title">[\s\S]*?(Address|Contact)\s*<\/h3>/.test(card))
    .join('')
}

export const telHref = (phone: string) => `tel:${phone.replace(/\D/g, '')}`
export const directionsHref = (department: ClinicDepartment) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${department.street} ${department.city}`)}`
