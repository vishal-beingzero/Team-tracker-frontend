export enum Sites {
    CODEFORCES,
    LEETCODE,
    CODECHEF,
    MENTORPICK,
    CSES
}


export const SiteExists = (currentSite: String):Boolean => {
    let siteExists = false;
    for(const site in Sites)
    {
        if(currentSite.toLocaleUpperCase()==site)
        {
            siteExists = true;
            break;
        }
    }
    return siteExists;
}