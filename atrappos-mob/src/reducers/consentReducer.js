
const initialState = {
    showSaveLocationConsent: true,
    showDrawTutorial: true,
    includeUserPaths: true,
    faqShown: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case 'SHOW_SAVE_LOCATION_CONSENT':
            return {
                ...state,
                showSaveLocationConsent: action.showSaveLocationConsent
            };
        case 'SHOW_DRAW_TUTORIAL':
            return {
                ...state,
                showDrawTutorial: action.showDrawTutorial
            };
        case 'INCLUDE_USER_PATHS':
            return {
                ...state,
                includeUserPaths: action.includeUserPaths
            };
        case 'FAQ_SHOWN':
            return {
                ...state,
                faqShown: action.faqShown
            };
        default:
            return state;
    }
}
