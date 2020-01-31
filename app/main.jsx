
import React from 'react';
import ReactDOM from 'react-dom';
import {
    TreeList, mapTree, extendDataItem
} from '@progress/kendo-react-treelist';
import employees from './data';

const subItemsField = 'employees';
const expandField = 'expanded';

const MyCell = (props) => {

      const { hasChildren, level = [0], expanded, dataItem, format } = props;
        const data = dataItem[props.field];
        let dataAsString = '';

        if (data !== undefined && data !== null) {
            dataAsString = format ?
                provideIntlService(this).format(format, data) :
                data.toString();
        }

        const icons = [];
        if (props.expandable) {
            icons.push(...level.slice(1).map((_x, i) => (<span className="k-icon k-i-none" key={i} />)));
            if (hasChildren) {
                icons.push(
                    <span
                        className={`k-icon k-i-${expanded ? 'collapse' : 'expand'}`}
                        key="expand-collapse"
                        onClick={event => props.onExpandChange(event, dataItem)}
                    />
                );
            } else {
                icons.push(<span className="k-icon k-i-none" key={icons.length} />);
            }
        }

    return (
        <td
            style={props.style}
            className={props.className}
            colSpan={props.colSpan}
        >
            {icons}
            {dataAsString}
        </td>
    );
}

const App = (props) => {

  const [state, setState] = React.useState({
      data: employees.slice(),
      expanded: [1, 2, 32]
  });

    const onExpandChange = (e) => {
        setState({
            ...state,
            expanded: e.value ?
                state.expanded.filter(id => id !== e.dataItem.id) :
                [...state.expanded, e.dataItem.id]
        });
    }
    const updateFields = (dataArr) => {
        const { expanded } = state;
        return mapTree(dataArr, subItemsField, (item) =>
            extendDataItem(item, subItemsField, {
                expanded: expanded.includes(item.id)
            })
        );
    }

      return (
          <TreeList
              style={{ maxHeight: '510px', overflow: 'auto' }}
              data={updateFields(state.data)}
              expandField={expandField}
              subItemsField={subItemsField}
              onExpandChange={onExpandChange}
              columns={[
                  { field: 'name', title: 'Name', expandable: true, width: '40%', cell: MyCell },
                  { field: 'position', title: 'Position', width: '40%' },
                  { field: 'fullTime', title: 'Full Time', width: '20%' }
              ]}
          />
      );

}

ReactDOM.render(
    <App />,
    document.querySelector('my-app')
);

