export const get_map_vote_path = (map_name: string) => {
    switch(map_name) {
        case "Valley": 
            return "/valley.jpg";
        case "Volcano": 
            return "/volcano.jpeg";
        case "Everest": 
            return "/everest.jpeg";
        default:
            return "/some_placeholder.jpg";
    }
}