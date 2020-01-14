
import React from 'react';
import ReactDOM from 'react-dom';
import {
    TreeList, mapTree, extendDataItem
} from '@progress/kendo-react-treelist';
import employees from './data';

const subItemsField = 'employees';
const expandField = 'expanded';

class MyCell extends React.Component {
    render() {
        const { hasChildren, level = [0], expanded, dataItem, format } = this.props;
        const data = dataItem[this.props.field];
        let dataAsString = '';

        if (data !== undefined && data !== null) {
            dataAsString = format ?
                provideIntlService(this).format(format, data) :
                data.toString();
        }

        const icons = [];
        if (this.props.expandable) {
            icons.push(...level.slice(1).map((_x, i) => (<span className="k-icon k-i-none" key={i} />)));
            if (hasChildren) {
                icons.push(
                    <span
                        className={`k-icon k-i-${expanded ? 'collapse' : 'expand'}`}
                        key="expand-collapse"
                        onClick={event => this.props.onExpandChange(event, dataItem)}
                    />
                );
            } else {
                icons.push(<span className="k-icon k-i-none" key={icons.length} />);
            }
        }

        return (
            <td
                style={this.props.style}
                className={this.props.className}
                colSpan={this.props.colSpan}
            >
                {icons}
                {dataAsString}
            </td>
        );
    }
}

class App extends React.Component {
    state = {
        data: employees.slice(),
        expanded: [1, 2, 32]
    }

    onExpandChange = (e) => {
        this.setState({
            expanded: e.value ?
                this.state.expanded.filter(id => id !== e.dataItem.id) :
                [...this.state.expanded, e.dataItem.id]
        });
    }
    updateFields = (dataArr) => {
        const { expanded } = this.state;
        return mapTree(dataArr, subItemsField, (item) =>
            extendDataItem(item, subItemsField, {
                expanded: expanded.includes(item.id)
            })
        );
    }
    render() {
        return (
            <TreeList
                style={{ maxHeight: '510px', overflow: 'auto' }}
                data={this.updateFields(this.state.data)}
                expandField={expandField}
                subItemsField={subItemsField}
                onExpandChange={this.onExpandChange}
                columns={[
                    { field: 'name', title: 'Name', expandable: true, width: '40%', cell: MyCell },
                    { field: 'position', title: 'Position', width: '40%' },
                    { field: 'fullTime', title: 'Full Time', width: '20%' }
                ]}
            />
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('my-app')
);

