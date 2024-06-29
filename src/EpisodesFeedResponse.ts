export interface EpisodesFeedReponse {
    success: boolean
    data: EpisodesFeedReponseData
  }
  
  export interface EpisodesFeedReponseData {
    podcasts: Podcast[]
    paginateData: PaginateData
  }
  
  export interface Podcast {
    resume: string
    date: string
    date_modified_gmt: string
    image: string
    metadata: Metadata
    author: Author
    type: string
    title: string
    content: Content
    url: string
    yoast_seo: YoastSeo
    date_modified: string
    id: number
    categories: Categories
    date_gmt: string
    slug: string
    status: string
    galleries?: any[]
  }
  
  export interface Metadata {
    podcast_insertion: string
    publicidade_ads: PublicidadeAd[]
    podcast_ad: string
    podcast_extra_3_rpt: string
    feed_image: FeedImage
    publicidade_insercao: PublicidadeInsercao[]
    podcast_medium: string
    podcast_low: string
    podcast_skip_1: string
    podcast_skip_2: string
    podcast_editor_url: string
    podcast_extra_2_rpt: string
    podcast_editor_name: string
    podcast_duration: number
    podcast_episode: string
    catecetaa_de_agulha: CatecetaaDeAgulha[]
    escalpo_solidario: EscalpoSolidario[]
    podcast_high: string
    podcast_extra_1_rpt: string
    podcast_zip: string
    arte_dos_fas: ArteDosFa[]
  }
  
  export interface PublicidadeAd {
    buttom_link: string
    image: Image
    buttom_text: string
    text: string
    title: string
  }
  
  export interface Image {}
  
  export interface FeedImage {
    date: string
    id: number
    mimeType: string
    url: string
  }
  
  export interface PublicidadeInsercao {
    buttom_link: string
    image: Image2
    start_time: string
    notification: string
    buttom_text: string
    end_time: string
    title: string
  }
  
  export interface Image2 {
    date: string
    id: number
    mimeType: string
    url: string
  }
  
  export interface CatecetaaDeAgulha {
    name: string
    link: string
  }
  
  export interface EscalpoSolidario {
    name: string
    link: string
  }
  
  export interface ArteDosFa {
    image: string
    link: string
    title: string
  }
  
  export interface Author {
    image: string
    name: string
    id: number
    slug: string
    email: string
  }
  
  export interface Content {
    formated: string
    raw: string
  }
  
  export interface YoastSeo {
    estimated_reading_time_minutes: string
    linkdex?: string
    focuskw?: string
    metadesc?: string
    content_score: string
    primary_podcast_theme: string
    title?: string
  }
  
  export interface Categories {
    podcast_theme: PodcastTheme[]
    podcast_guest?: PodcastGuest[]
    news_tag?: NewsTag[]
    podcast_product: PodcastProduct[]
  }
  
  export interface PodcastTheme {
    name: string
    id: number
    type: string
    slug: string
  }
  
  export interface PodcastGuest {
    metadata: Metadata2
    name: string
    id: number
    type: string
    slug: string
  }
  
  export interface Metadata2 {
    guest_twitter?: string
    guest_photo: string
    status: string
  }
  
  export interface NewsTag {
    name: string
    id: number
    type: string
    slug: string
  }
  
  export interface PodcastProduct {
    metadata: Metadata3
    name: string
    id: number
    type: string
    slug: string
  }
  
  export interface Metadata3 {
    status: string
  }
  
  export interface PaginateData {
    findResultTotal: number
    registersPerPage: number
    totalPages: number
    currentPage: number
    lastHitSort: number
  }
  