import { useEffect } from "react";
// import { IOccupation } from "../models/IOccupation";
import { getOccupation } from "../service/taxonomyService";
import { OccupationContext } from "../contexts/OccupationContext";
import { useContext } from "react";
import { ActionType } from "../reducers/OccupationReducer";

export const OccupationsFetcher = () => {
  const { dispatch } = useContext(OccupationContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOccupation();
      dispatch({ type: ActionType.SET_OCCUPATIONS, payload: data });
    };

    fetchData();
  }, [dispatch]);

  return null;
};

export default OccupationsFetcher;
