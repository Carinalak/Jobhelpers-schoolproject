import { useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterBtnYrke } from "../components/FilterBtnYrke";
import { JobsPresentation } from "../components/JobsPresentation";
import { JobContext } from "../contexts/JobContext";
import { SearchJob } from "../components/SearchJob";
import { Pagination } from "../components/Pagination";
import { getJobsBySearch, JOBS_PER_PAGE } from "../service/jobService";
import { ActionType } from "../reducers/JobReducer";

export const Jobs = () => {
  const { jobs, dispatch } = useContext(JobContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const searchTermParam = searchParams.get("searchTerm");
  const occupationsParam = decodeURIComponent(
    searchParams.get("occupations") || ""
  );

  const [currentPage, setCurrentPage] = useState<number>(
    pageParam ? parseInt(pageParam) : 1
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>(
    searchTermParam || ""
  );

  const fetchJobs = useCallback(
    async (term: string, page: number, occupations?: string) => {
      try {
        const totalHits = 100; // Justera om API ger faktisk träffsumma
        const jobsPerPage = JOBS_PER_PAGE;

        const jobs = await getJobsBySearch(term, page, occupations);
        dispatch({ type: ActionType.SEARCHED, payload: jobs });

        setTotalPages(Math.ceil(totalHits / jobsPerPage));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchJobs(activeSearchTerm, currentPage, occupationsParam);
    dispatch({ type: ActionType.FILTER_JOBS, payload: occupationsParam });
  }, [currentPage, activeSearchTerm, occupationsParam, fetchJobs, dispatch]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSearchParams({
      page: String(newPage),
      searchTerm: activeSearchTerm,
      occupations: occupationsParam,
    });
  };

  const handleSearch = (term: string) => {
    setActiveSearchTerm(term);
    setCurrentPage(1);
    setSearchParams({
      page: "1",
      searchTerm: term,
      occupations: occupationsParam,
    });
  };

  return (
    <div>
      <div className="jobs-search-filter">
        <SearchJob onSearch={handleSearch} />
        <FilterBtnYrke />
      </div>

      <JobsPresentation
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        jobs={jobs}
      />

      {totalPages > 1 && (
        <Pagination
          key={`pagination-${currentPage}-${totalPages}`}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
