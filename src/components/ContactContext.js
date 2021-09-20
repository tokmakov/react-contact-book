import { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initState = {
    contacts: [
        {
            id: uuidv4(),
            firstName: 'John',
            lastName: 'Smith',
            phone: '555-123-123',
        },
        {
            id: uuidv4(),
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '555-123-123',
        },
        {
            id: uuidv4(),
            firstName: 'Jack',
            lastName: 'Sparrow',
            phone: '555-555-444',
        },
        {
            id: uuidv4(),
            firstName: 'Fluffy',
            lastName: 'White',
            phone: '555-678-910',
        },
    ],
    // id контакта, который выделен и будет удален или отредактирован
    selected: null,
    // признак того, что книга переключена в режим редактирования
    editmode: false,
};

export const Types = {
    APPEND: 'APPEND',
    SELECT: 'SELECT',
    EDITMD: 'EDTMOD',
    UPDATE: 'UPDATE',
    REMOVE: 'REMOVE',
    ROLLBACK: 'ROLLBACK',
};

let backup = [];

function contactReducer(state, action) {
    switch (action.type) {
        case Types.APPEND: // добавить новый контакт
            const contact = {id: uuidv4(), ...action.payload}
            return {
                ...state,
                contacts: [...state.contacts, contact],
            };
        case Types.SELECT: // выделить контакт для редактирования или удаления
            return state.editmode ? {
                ...state,
                selected: action.payload.id,
            } : state;
        case Types.EDTMOD: // включить-выключить режим редактирования
            // будем сохранять backup перед редактированием или удалением
            backup = !state.editmode ? [] : backup;
            const selected =
                (!state.editmode && !state.selected && state.contacts.length)
                ?
                (state.contacts[0].id) : (state.selected);
            return {
                ...state,
                editmode: !state.editmode,
                selected: selected,
            };
        case Types.UPDATE: // обновить отредактированный контакт
            if (!state.selected) return state;
            backup.push(JSON.stringify(state.contacts)); // выполянем backup
            const index = state.contacts.findIndex(item => item.id === state.selected);
            if (index < 0) return state;
            const arrayCopy = [...state.contacts];
            arrayCopy.splice(index, 1, {id: state.selected, ...action.payload});
            return {
                ...state,
                contacts: arrayCopy,
            };
        case Types.REMOVE: // удалить выделенный контакт
            if (!state.selected) return state;
            backup.push(JSON.stringify(state.contacts)); // выполянем backup
            const contacts = state.contacts.filter(item => item.id !== state.selected);
            return {
                ...state,
                contacts: contacts,
                selected: contacts.length ? contacts[0].id : null,
            };
        case Types.ROLLBACK: // восстановить записную книжку из резервной копии
            return backup.length ? {
                ...state,
                contacts: JSON.parse(backup.pop()),
                selected: null,
            } : state;
        default:
            console.log(`Action type ${action.type} was not recognized`);
            return state;
    }
}

const ContactContext = createContext();

export function ContactProvider(props) {
    const [state, dispatch] = useReducer(contactReducer, initState);
    return <ContactContext.Provider value={[state, dispatch]} {...props} />;
}

export function useContact() {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('Contact context can be accessed only under ContactProvider');
    }
    return context;
}
