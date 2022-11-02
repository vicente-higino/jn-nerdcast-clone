export interface EpisodePageResponse {
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
  subject: string;
  image: string;
  image_alt?: any;
  audio_high: string;
  audio_medium: string;
  audio_low: string;
  audio_zip: string;
  insertions: any[];
  ads: any[];
  description: string;
  'jump-to-time': Jumptotime;
  guests: Guest[];
  'cacete-de-agulha': any[];
  'escalpo-solidario': any[];
  'fan-arts': any[];
  editor: Editor;
  comments?: any;
  post_type_class: string;
}

interface Editor {
  name: string;
  link: string;
}

interface Guest {
  id: number;
  name: string;
  twitter: string;
  image: string;
}

interface Jumptotime {
  test: string;
  'start-time': number;
  'end-time': number;
}