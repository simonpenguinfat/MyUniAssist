import { UNIVERSITIES, type University } from "@/lib/universities";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type DbRow = {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  us_news_rank?: number | null;
  acceptance_rate: number | null;
  avg_gpa: number | null;
  sat_mid: number | null;
  act_mid: number | null;
  tuition_usd?: number | null;
  setting: string;
  interests: string;
  personality_fit: string;
  extracurricular_fit: string;
  vr_tour_url: string;
  cds_url: string;
  website_url: string;
  size_band: string;
};

function mapRow(row: DbRow): University {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    region: row.region,
    usNewsRank: row.us_news_rank ?? null,
    acceptanceRate: row.acceptance_rate == null ? null : Number(row.acceptance_rate),
    avgGpa: row.avg_gpa == null ? null : Number(row.avg_gpa),
    satMid: row.sat_mid == null ? null : Number(row.sat_mid),
    actMid: row.act_mid == null ? null : Number(row.act_mid),
    tuitionUsd: row.tuition_usd == null ? null : Number(row.tuition_usd),
    setting: row.setting,
    interests: row.interests,
    personalityFit: row.personality_fit,
    extracurricularFit: row.extracurricular_fit,
    vrTourUrl: row.vr_tour_url,
    cdsUrl: row.cds_url,
    websiteUrl: row.website_url,
    sizeBand: row.size_band,
  };
}

/** Prefer Supabase `universities` table when seeded; otherwise local seed data. */
export async function getUniversities(): Promise<University[]> {
  if (!isSupabaseConfigured()) {
    return UNIVERSITIES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return UNIVERSITIES;
    }

    return (data as DbRow[]).map(mapRow);
  } catch {
    return UNIVERSITIES;
  }
}

export function searchUniversityList(list: University[], q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return list;
  return list.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.city.toLowerCase().includes(query) ||
      u.state.toLowerCase().includes(query) ||
      u.region.toLowerCase().includes(query)
  );
}
