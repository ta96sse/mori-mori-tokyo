export interface Member {
    number: string;
    role: string;
    name: string;
    instagram?: string;
    strava?: string;
    desc: string;
    background: string;
}

export interface Race {
    title: string;
    category: string;
    location: string;
    start_date: string; // "2026/02/21"
    end_date?: string;
    url?: string;
    instagram?: string;
    facebook?: string;
    members?: string; // "Takuro, Hiroki"
    result?: string;
    show_in_log: string; // "TRUE" | "FALSE"

    // Calculated fields
    date?: string;
    _startDate?: string;
    _endDate?: string;
}

export interface SiteData {
    members: Member[];
    races: Race[];
}
