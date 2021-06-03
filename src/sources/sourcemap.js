import { NHentai, NHentaiInfo } from "./NHentai/NHentai";
import {
  MangaKatana,
  MangaKatanaInfo,
  MK_DOMAIN,
} from "./MangaKatana/MangaKatana";
import { Guya, GuyaInfo } from "./Guya/Guya";
import { MangaDex, MangaDexInfo } from "./MangaDex/MangaDex";
import { MangaLife, MangaLifeInfo } from "./MangaLife/MangaLife";
import { CatManga, CatMangaInfo } from "./CatManga/CatManga";
import { HentaiHere, HentaiHereInfo } from "./HentaiHere/HentaiHere";
import { CubariSourceMixin } from "./CubariSource";
import { ComicExtra, ComicExtraInfo } from "./ComicExtra/ComicExtra";
import { Readm, ReadmInfo } from "./Readm/Readm";
import cheerio from "cheerio";
// import { Mangakakalot, MangakakalotInfo } from "./Mangakakalot/Mangakakalot";

const hentai = localStorage.getItem("hentai");

const sourcemap = {};

if (hentai) {
  sourcemap["NHentai"] = new (CubariSourceMixin(
    NHentai,
    NHentaiInfo,
    (slug) => `https://cubari.moe/read/nhentai/${slug}/`
  ))(cheerio);
  sourcemap["MangaDex"] = new (CubariSourceMixin(
    MangaDex,
    MangaDexInfo,
    (slug) => `https://cubari.moe/read/mangadex/${slug}/`
  ))(cheerio, "contentRating[]=pornographic");
  sourcemap["HentaiHere"] = new (CubariSourceMixin(
    HentaiHere,
    HentaiHereInfo,
    (slug) => `https://hentaihere.com/m/${slug}`
  ))(cheerio);
} else {
  sourcemap["Guya"] = new (CubariSourceMixin(
    Guya,
    GuyaInfo,
    (slug) => `https://guya.moe/read/manga/${slug}/`
  ))(cheerio);
  sourcemap["MangaLife"] = new (CubariSourceMixin(
    MangaLife,
    MangaLifeInfo,
    (slug) => `https://cubari.moe/ml/${slug}/`
  ))(cheerio);
  sourcemap["MangaKatana"] = new (CubariSourceMixin(
    MangaKatana,
    MangaKatanaInfo,
    (slug) => `https://cubari.moe/mk/${MK_DOMAIN}/manga/${slug}/`
  ))(cheerio);
  // sourcemap["Mangakakalot"] = new (CubariSourceMixin(
  //   Mangakakalot,
  //   MangakakalotInfo,
  //   (slug) => `https://cubari.moe/mb/${slug}/`
  // ))(cheerio);
  sourcemap["CatManga"] = new (CubariSourceMixin(
    CatManga,
    CatMangaInfo,
    (slug) => `https://catmanga.org/series/${slug}/`
  ))(cheerio);
  sourcemap["MangaDex"] = new (CubariSourceMixin(
    MangaDex,
    MangaDexInfo,
    (slug) => `https://cubari.moe/read/mangadex/${slug}/`
  ))(cheerio);
  sourcemap["ComicExtra"] = new (CubariSourceMixin(
    ComicExtra,
    ComicExtraInfo,
    (slug) => `https://www.comicextra.com/comic/${slug}/`
  ))(cheerio);
  sourcemap["Readm"] = new (CubariSourceMixin(
    Readm,
    ReadmInfo,
    (slug) => `https://readm.org/manga/${slug}/`
  ))(cheerio);
}

export default sourcemap;
