export type ReceiptItem = {
  title: string;
  /** Kosongkan untuk struk "Top Artists". */
  artist?: string;
  /** Teks di kolom kanan: durasi ("3:45") atau jumlah putar ("12x"). */
  amount: string;
};

export type LikedTrack = {
  id: string;
  title: string;
  artist: string;
  seconds: number;
};
