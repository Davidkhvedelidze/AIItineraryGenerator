interface PlannerState {
  destination: string;
  travelers: number;
  interests: string[];
  step: number;
}

type PlannerAction =
  | {
      type: "destinationChanged";
      payload: string;
    }
  | {
      type: "travelersChanger";
      payload: number;
    }
  | {
      type: "interestToggler";
      payload: string;
    }
  | {
      type: "nextStep";
    }
  | {
      type: "reset";
    };

const initialState: PlannerState = {
  destination: "",
  travelers: 1,
  interests: [],
  step: 1,
};

function plannerReducer(state: PlannerState, action: PlannerAction) {
  switch (action.type) {
    case "destinationChanged":
      return {
        ...state,
        destination: action.payload,
      };

    case "travelersChanger":
      return {
        ...state,
        travelers: action.payload,
      };

    case "interestToggler": {
      const exists = state.interests.includes(action.payload);

      return {
        ...state,
        interests: exists
          ? state.interests.filter((interest) => interest !== action.payload)
          : [...state.interests, action.payload],
      };
    }

    case "nextStep":
      return {
        ...state,
        step: state.step + 1,
      };

    case "reset":
      return initialState;

    default:
      return state;
  }
}
