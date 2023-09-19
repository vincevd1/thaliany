export interface Members {
  count: number,
  next: string | null,
  previous: string | null,
  results: ThaliaUser[] | null
}
  export interface ThaliaUser {
    pk: number
    membership_type: string
    profile: Profile
    achievements: []
    societies: []
  } 
    export interface Profile {
      display_name: string
      short_display_name: string
      birthday: string
      photo: Photo
      programme: string
      starting_year: number
      address_street: string
      address_street2: string
      address_postal_code: string
      address_city: string
      address_country: string
      phone_number: string
      emergency_contact: string
      emergency_contact_phone_number: string
      show_birthday: boolean
      website: string
      profile_description: string
      initials: string
      nickname: string
      display_name_preference: string
      receive_optin: boolean
      receive_newsletter: boolean
      email_gsuite_only: boolean
    }
      export interface Photo {
          full: string
          large: string
          medium: string
          small: string
      }