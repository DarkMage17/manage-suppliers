export interface Supplier {
    id: number
    companyName: string
    tradeName: string
    taxIdentification: string
    phoneNumber: string
    email: string
    website: string
    physicalAddress: string
    country: string
    annualBilling: number
    lastEdit: Date | null
}