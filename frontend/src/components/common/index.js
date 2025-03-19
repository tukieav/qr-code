// frontend/src/components/common/index.js
// Ten plik umożliwia łatwiejsze importowanie komponentów wspólnych

// Importy komponentów
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ConfirmDialog from './ConfirmDialog';
import DataFilters from './DataFilters';
import DataItemActions from './DataItemActions';
import DataList from './DataList';
import Notification from './Notification';
import PrivateRoute from './PrivateRoute';

// Eksport komponentów
export {
    Navbar,
    Sidebar,
    ConfirmDialog,
    DataFilters,
    DataItemActions,
    DataList,
    Notification,
    PrivateRoute
};

// Eksport domyślny - wszystkie komponenty
export default {
    Navbar,
    Sidebar,
    ConfirmDialog,
    DataFilters,
    DataItemActions,
    DataList,
    Notification,
    PrivateRoute
};