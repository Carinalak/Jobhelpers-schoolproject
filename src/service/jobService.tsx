import { IJob } from "../models/IJob";
import { get } from "./jobBase";

export const JOBS_PER_PAGE = 5;

// Hämta alla jobb (används ev. inte om du alltid filtrerar)
export const getJobs = async (): Promise<IJob[]> => {
  try {
    const jobs = await get<IJob>("");
    console.log("Jobs fetched:", jobs);
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// Hämta jobb med söktermer, paginering och valfria yrkesfilter
export const getJobsBySearch = async (
  searchTerm: string,
  page: number = 1,
  occupations?: string
): Promise<IJob[]> => {
  try {
    const jobsPerPage = JOBS_PER_PAGE;
    const offset = (page - 1) * jobsPerPage;

    let endpoint = `?q=${encodeURIComponent(searchTerm)}&offset=${offset}&limit=${jobsPerPage}`;

    if (occupations && occupations.trim() !== "") {
      endpoint += `&occupations=${encodeURIComponent(occupations)}`;
    }

    const jobs = await get<IJob>(endpoint);

    console.log(
      `Jobs fetched for term "${searchTerm}", page ${page}, occupations "${occupations}":`,
      jobs
    );

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs by search:", error);
    return [];
  }
};
