import React from 'react'
import { Menu, Dropdown, Popup } from 'semantic-ui-react'
import Configuration from '../../shared/components/config'
import SnapshotList from './snapshots/snapshotList'
import PricingSelector from '../../shared/components/pricingSelector'

export default class MenuBar extends React.Component {

    constructor(props){
        super(props)
        this.handleOptimize = this.handleOptimize.bind(this)
        this.handleDropdownChange = this.handleDropdownChange.bind(this)
    }

    async handleDropdownChange(event, data, type){
        let tempConfig = this.props.config
        tempConfig[type] = data.value
        await this.props.handleParentState("config", tempConfig, "groupAndSortRecalc")
    }

    async handleOptimize(e){
        let tempConfig = this.props.config
        tempConfig["optimizeBy"] = e.target.value
        await this.props.handleParentState("config", tempConfig, "groupAndSortRecalc")
    }

    render() {
        const groupOptions = [
            { key: 1, text: 'NR Account', value: 'accountName' },
            { key: 2, text: 'Cloud Account', value: 'providerAccountName' },
            { key: 3, text: 'Applications', value: 'apmApplicationNames' },
            { key: 4, text: 'Region', value: 'region' },
            { key: 5, text: 'Instance Type', value: 'instanceType' },
            { key: 6, text: 'Suggested Instance Type', value: 'suggestedInstanceType' }
        ]

        const sortOptions = [
            { key: 1, text: 'Saving Value', value: 'saving' },
            { key: 2, text: 'Non Optimized Value', value: 'nonOptimizedCost' },
            { key: 3, text: 'Non Optimized Count', value: 'nonOptimizedCount' },
            { key: 4, text: 'Optimized Value', value: 'optimizedCost' },
            { key: 5, text: 'Optimized Count', value: 'optimizedCount' },
            { key: 6, text: 'Instance Count', value: 'totalInstances' }
        ]

        return(
            <Menu inverted={false} className="menu-bar">
                <Menu.Item>Group By:</Menu.Item>
                <Dropdown 
                    options={groupOptions} simple item
                    onChange={(event, data)=>{this.handleDropdownChange(event, data, "groupBy")}} 
                    value={this.props.config.groupBy || "accountName"}
                />
                <Menu.Item>{this.props.instanceLength}</Menu.Item>

                <Menu.Item>Sort By:</Menu.Item>
                <Dropdown 
                    options={sortOptions} simple item
                    onChange={(event, data)=>{this.handleDropdownChange(event, data, "sortBy")}} 
                    value={this.props.config.sortBy || "nonOptimizedCost"}
                />
                <Popup
                    trigger={<Menu.Item>Optimize By:</Menu.Item>}
                    content={"Optimize Instances below " + this.props.config.optimizeBy + "% CPU or Memory Utilization"}
                    basic
                />
                <Menu.Item><input type='range' max='75' step='1' value={this.props.config.optimizeBy} onChange={this.handleOptimize} style={{width:"100%"}}/></Menu.Item>
                <Popup
                    trigger={<Menu.Item>{this.props.config.optimizeBy}</Menu.Item>}
                    content={"Optimize Instances below " + this.props.config.optimizeBy + "% CPU or Memory Utilization"}
                    basic
                />

                <Menu.Menu position='right'>
                    <SnapshotList snapshots={this.props.snapshots} cloudOptimizeSnapshots={this.props.cloudOptimizeSnapshots} fetchSnapshots={this.props.fetchSnapshots}/>
                    <PricingSelector config={this.props.config} cloudRegions={this.props.cloudRegions} handleParentState={this.props.handleParentState} fetchCloudPricing={this.props.fetchCloudPricing} />
                    <Configuration config={this.props.config} handleParentState={this.props.handleParentState} />
                </Menu.Menu>     
            </Menu>
        )
    }
}