import ItemView from '../Components/ItemView/ItemView';

import { useLocation } from 'react-router-dom';

function ItemPage() {

    const location = useLocation();

    const { searchType, query } = location.state || {};

    console.log(searchType, query)
  
    return (

      <ItemView searchType={searchType} query={query} />

    );

  }

export default ItemPage;