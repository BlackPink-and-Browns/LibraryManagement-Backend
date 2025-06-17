export type OpenLibraryBook = {
  identifiers?: {
    goodreads?: string[];
    librarything?: string[];
    [key: string]: string[]; // fallback for other identifiers
  };
  title: string;
  authors?: {
    key: string;
  }[];
  publish_date?: string;
  publishers?: string[];
  covers?: number[];
  contributions?: string[];
  languages?: {
    key: string;
  }[];
  source_records?: string[];
  local_id?: string[];
  type?: {
    key: string;
  };
  first_sentence?: {
    type: string;
    value: string;
  };
  key: string;
  number_of_pages?: number;
  works?: {
    key: string;
  }[];
  classifications?: Record<string, unknown>;
  ocaid?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  latest_revision?: number;
  revision?: number;
  created?: {
    type: string;
    value: string;
  };
  last_modified?: {
    type: string;
    value: string;
  };
};