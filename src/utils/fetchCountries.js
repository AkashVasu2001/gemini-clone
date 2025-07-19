const fetchCountries = async () => {
    let res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd")
    let data = await res.json()
    return data.map((x) => ({
        name: x.name.common,
        code: x.cca2,
        dial:x.idd?.root && x.idd.suffixes ?`${x.idd.root}${x.idd.suffixes[0]}`:null
    })).filter((x)=>x.dial!=null).sort((a,b)=>a.name.localeCompare(b.name))
}
export default fetchCountries