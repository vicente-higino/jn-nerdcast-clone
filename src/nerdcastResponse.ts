export interface ResponseObject {
    data: Datum[];
    per_page: number;
    page: number;
    count: number;
    pages: number;
    offset: number;
    order?: any;
    orderby?: any;
}

export interface Datum {
    id: number;
    url: string;
    published_at: string;
    pub_date: string;
    modified_at: string;
    duration: number;
    title: string;
    slug: string;
    episode: string;
    product: string;
    product_name: string;
    product_email: string;
    friendly_post_type: string;
    friendly_post_type_slug: string;
    friendly_post_time: string;
    friendly_post_date: string;
    subject: string;
    image: string;
    image_alt?: any;
    thumbnails: Thumbnails;
    audio_high: string;
    audio_medium: string;
    audio_low: string;
    audio_zip: string;
    insertions: Insertion[];
    description: string;
    'jump-to-time': Jumptotime;
    guests: string;
    post_type_class: string;
}

interface Jumptotime {
    test: string;
    'start-time': number;
    'end-time': number;
}

interface Insertion {
    id: number;
    title: string;
    image: string;
    link: string;
    'button-title': string;
    'start-time': number;
    'end-time': number;
    sound: boolean;
}

interface Thumbnails {
    '1536x1536': string;
    '2048x2048': string;
    'img-4x3-355x266': string;
    'img-16x9-1210x544': string;
    'img-16x9-760x428': string;
    'img-4x6-448x644': string;
    'img-1x1-3000x3000': string;
}