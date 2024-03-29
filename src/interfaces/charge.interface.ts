export interface ChargeResponse {
    object:               string;
    id:                   string;
    creation_date:        number;
    amount:               number;
    amount_refunded:      number;
    current_amount:       number;
    installments:         number;
    installments_amount:  null;
    currency_code:        string;
    email:                string;
    description:          null;
    source:               Source;
    outcome:              Outcome;
    fraud_score:          null;
    antifraud_details:    AntifraudDetails;
    dispute:              boolean;
    capture:              boolean;
    capture_date:         number;
    reference_code:       string;
    authorization_code:   string;
    duplicated:           boolean;
    metadata:             ChargeResponseMetadata;
    total_fee:            number;
    fee_details:          FeeDetails;
    total_fee_taxes:      number;
    transfer_amount:      number;
    paid:                 boolean;
    statement_descriptor: string;
    transfer_id:          null;
}

export interface AntifraudDetails {
    first_name:   string;
    last_name:    string;
    address:      string;
    address_city: string;
    country_code: string;
    phone:        string;
    object:       string;
}

export interface FeeDetails {
    fixed_fee:    FixedFee;
    variable_fee: VariableFee;
}

export interface FixedFee {
}

export interface VariableFee {
    currency_code: string;
    commision:     number;
    total:         number;
}

export interface ChargeResponseMetadata {
    documentNumber: string;
}

export interface Outcome {
    type:             string;
    code:             string;
    merchant_message: string;
    user_message:     string;
}

export interface Source {
    object:        string;
    id:            string;
    type:          string;
    creation_date: number;
    email:         string;
    card_number:   string;
    last_four:     string;
    active:        boolean;
    iin:           Iin;
    client:        Client;
    metadata:      SourceMetadata;
}

export interface Client {
    ip:                 string;
    ip_country:         string;
    ip_country_code:    string;
    browser:            string;
    device_fingerprint: null;
    device_type:        string;
}

export interface Iin {
    object:               string;
    bin:                  string;
    card_brand:           string;
    card_type:            string;
    card_category:        null;
    issuer:               Issuer;
    installments_allowed: any[];
}

export interface Issuer {
    name:         string;
    country:      string;
    country_code: string;
    website:      string;
    phone_number: string;
}

export interface SourceMetadata {
    dni: string;
}
