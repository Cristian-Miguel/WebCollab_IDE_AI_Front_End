export interface User {
    id?              :string,
    email            :string,
    fullName         :string,
    birthDate        :Date,
    profileImageUrl? :string,
    isEmailVerified  :boolean,
    address          :Address,
    role             :Role,
}

export interface Address {
    id?             :string,
    street          :string,
    internalNumber? :string,
    externalNumber? :string,
    neighborhood    :string,
    locality        :string,
    municipality    :string,
    state           :string,
    zipCode         :string,
    country         :string,
}

export interface Role {
    name        :string,
    description :string,
}