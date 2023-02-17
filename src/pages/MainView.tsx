import React, {useEffect, useRef, useState} from 'react'
import { EuiButton, EuiFieldText, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiRadioGroup, EuiText,
    EuiPage, EuiPageBody, EuiPageHeader, EuiPageSection, EuiPanel, EuiDescriptionList } from '@elastic/eui'
import ForceGraph from "./ForceGraph";
import getMovie from "../service/MovieService";
import getPerson from "../service/PersonService";

enum searchOptions {
    MOVIE = 'movie',
    PERSON = 'person'
}

const MainView = () => {

    const [searchValue, setSearchValue] = useState('')
    const [searchOption, setSearchOption] = useState<searchOptions>(searchOptions.MOVIE)
    const [graphData, setGraphData] = useState({nodes: [], links: []})
    const [chart, setChart] = useState(ForceGraph(graphData, {
                                    nodeId: d => d.id,
                                    //@ts-ignore
                                    nodeGroup: d => d.group,
                                    //@ts-ignore
                                    nodeTitle: d => `${d.text}`,
                                    //@ts-ignore
                                    linkStrokeWidth: l => Math.sqrt(l.value),
                                    width: 600,
                                    height: 600,
                                    nodeRadius: 15,
                                    nodeStrength: 0
                                }))
    const [descriptionData, setDescriptionData] = useState([{
        title: '',
        description: ''
    },])
    const [isLoading, setIsLoading] = useState(false)

    const radioOptions = [
        {
            id: searchOptions.MOVIE,
            label: 'Movie'
        },
        {
            id: searchOptions.PERSON,
            label: 'Person'
        }
    ]

    const onRadioChange = (optionId: string) => {
        if(optionId === searchOptions.PERSON)
            setSearchOption(searchOptions.PERSON)
        else
            setSearchOption(searchOptions.MOVIE)
    }

    const onSearchButtonClick = () => {
        setIsLoading(true)
        if(searchOption == searchOptions.MOVIE){
            getMovie(searchValue)
                .then(response => {
                    console.log(response)
                    setGraphData({
                        nodes: response.data.nodes,
                        links: response.data.links
                    })
                    const movie = response.data.movie
                    setDescriptionData([
                        {
                            title: 'Title',
                            description: movie.title
                        },
                        {
                            title: 'Tagline',
                            description: movie.tagline
                        },
                        {
                            title: 'Overview',
                            description: movie.overview
                        },
                        {
                            title: 'Release date',
                            description: movie.release_date
                        },
                        {
                            title: 'Score',
                            description: '' + movie.vote_avg + ' from ' + movie.vote_count + ' votes'
                        },
                    ])
                })
                .catch(error => {
                    console.log(error)
                    setGraphData({nodes: [], links: []})
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
        if(searchOption == searchOptions.PERSON){
            getPerson(searchValue)
                .then(response => {
                    console.log(response)
                    setGraphData({
                        nodes: response.data.nodes,
                        links: response.data.links
                    })
                    const person = response.data.person
                    setDescriptionData([
                        {
                            title: 'Name',
                            description: person.name
                        },
                        {
                            title: 'Biography',
                            description: person.biography
                        },
                        {
                            title: 'Birthday',
                            description: person.birthday
                        },
                        {
                            title: 'Death',
                            description: person.deathday ? person.deathday : ''
                        },
                    ])
                })
                .catch(error => {
                    console.log(error)
                    setGraphData({nodes: [], links: []})
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }

    useEffect(() => {
        if(graphData) {
            const newChart = ForceGraph(graphData, {
                nodeId: d => d.id,
                //@ts-ignore
                nodeGroup: d => d.group,
                //@ts-ignore
                nodeTitle: d => `${d.text}`,
                //@ts-ignore
                linkStrokeWidth: l => Math.sqrt(l.value),
                width: 600,
                height: 600,
                nodeRadius: 15,
                nodeStrength: 0
            })

            setChart(newChart)
        }
    }, [graphData])

    const svg = useRef(null);
    useEffect(()=>{
        if (svg.current) {
            //@ts-ignore
            svg.current.appendChild(chart)
        }
    }, []);

    useEffect(()=>{
        console.log(chart)
        console.log(svg)
        if (svg.current) {
            //@ts-ignore
            svg.current.replaceChild(chart, svg.current.children[0])
        }
    }, [chart]);

    return (
        <EuiPage >
            <EuiPageBody >
                <EuiPageSection bottomBorder={'extended'} >
                    <EuiPageHeader pageTitle={"GraphMovieDB"}/>
                </EuiPageSection>
                <EuiPageSection color={'plain'} alignment={'top'}>
                    <EuiPanel paddingSize={'s'} hasBorder={true} hasShadow={true}>
                        <EuiFlexGroup >
                            <EuiFlexItem grow={4}>
                                <EuiPanel paddingSize={'none'} hasBorder={false} hasShadow={false}>
                                    <EuiRadioGroup
                                        options={radioOptions}
                                        idSelected={searchOption}
                                        onChange={(id) => onRadioChange(id)}
                                        name={'optionRadio'}
                                        disabled={isLoading}
                                    />
                                </EuiPanel>
                            </EuiFlexItem>
                            <EuiFlexItem grow={6}>
                                <EuiFieldSearch
                                    placeholder='Movie title or actor name'
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    fullWidth={true}
                                    isLoading={isLoading}
                                />
                            </EuiFlexItem>
                            <EuiFlexItem grow={2}>
                                <EuiButton
                                    onClick={onSearchButtonClick}
                                    disabled={isLoading}
                                    >
                                    Search
                                </EuiButton>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiPanel>
                </EuiPageSection>
                <EuiPageSection>
                    <EuiDescriptionList listItems={descriptionData} />
                </EuiPageSection>
                <EuiPageSection color={'plain'} alignment={'top'} grow>
                    <EuiPanel>
                        <div ref={svg}/>
                    </EuiPanel>
                </EuiPageSection>
            </EuiPageBody>
        </EuiPage>
    )
}

export default MainView