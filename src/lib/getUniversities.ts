import {
  UNIVERSITIES,
  UNIVERSITIES_BY_ID,
  type AdmissionFactors,
  type University,
} from "@/lib/universities";
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
  sat_25?: number | null;
  sat_75?: number | null;
  act_mid: number | null;
  act_25?: number | null;
  act_75?: number | null;
  tuition_usd?: number | null;
  tuition_in_state_usd?: number | null;
  tuition_out_of_state_usd?: number | null;
  total_cost_usd?: number | null;
  is_public?: boolean | null;
  admission_factors?: AdmissionFactors | null;
  admission_factors_year?: string | null;
  acceptance_rate_year?: string | null;
  setting: string;
  interests: string;
  personality_fit: string;
  extracurricular_fit: string;
  vr_tour_url: string;
  cds_url: string;
  website_url: string;
  size_band: string;
};

const EMPTY_FACTORS: AdmissionFactors = {
  rigor: null,
  classRank: null,
  gpa: null,
  tests: null,
  essay: null,
  recommendations: null,
  interview: null,
  extracurriculars: null,
  talent: null,
  character: null,
  firstGeneration: null,
  alumniRelation: null,
  geographicResidence: null,
  stateResidency: null,
  volunteerWork: null,
  workExperience: null,
  applicantInterest: null,
};

function numeric(value: unknown): number | null {
  return value == null ? null : Number(value);
}

/**
 * Columns added for the admissions model may not exist in an older Supabase
 * table, so anything missing falls back to the bundled CDS seed for that school
 * rather than silently scoring against nulls.
 */
function mapRow(row: DbRow): University {
  const seed = UNIVERSITIES_BY_ID.get(row.id);

  return {
    id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    region: row.region,
    usNewsRank: row.us_news_rank ?? seed?.usNewsRank ?? null,
    acceptanceRate: numeric(row.acceptance_rate) ?? seed?.acceptanceRate ?? null,
    avgGpa: numeric(row.avg_gpa) ?? seed?.avgGpa ?? null,
    satMid: numeric(row.sat_mid) ?? seed?.satMid ?? null,
    sat25: numeric(row.sat_25) ?? seed?.sat25 ?? null,
    sat75: numeric(row.sat_75) ?? seed?.sat75 ?? null,
    actMid: numeric(row.act_mid) ?? seed?.actMid ?? null,
    act25: numeric(row.act_25) ?? seed?.act25 ?? null,
    act75: numeric(row.act_75) ?? seed?.act75 ?? null,
    tuitionUsd: numeric(row.tuition_usd) ?? seed?.tuitionUsd ?? null,
    tuitionInStateUsd:
      numeric(row.tuition_in_state_usd) ?? seed?.tuitionInStateUsd ?? null,
    tuitionOutOfStateUsd:
      numeric(row.tuition_out_of_state_usd) ?? seed?.tuitionOutOfStateUsd ?? null,
    totalCostUsd: numeric(row.total_cost_usd) ?? seed?.totalCostUsd ?? null,
    isPublic: row.is_public ?? seed?.isPublic ?? false,
    admissionFactors:
      row.admission_factors ?? seed?.admissionFactors ?? EMPTY_FACTORS,
    admissionFactorsYear:
      row.admission_factors_year ?? seed?.admissionFactorsYear ?? null,
    acceptanceRateYear:
      row.acceptance_rate_year ?? seed?.acceptanceRateYear ?? null,
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
