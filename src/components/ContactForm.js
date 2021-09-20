import { useEffect, useState, useRef } from 'react';
import { useContact, Types } from './ContactContext';

const emptyLocalState = {
    firstName: '',
    lastName: '',
    phone: '',
}

export function ContactForm() {
    const [state, dispatch] = useContact();
    const { contacts, selected, editmode } = state;

    const [localState, setLocalState] = useState(emptyLocalState);

    const inputFirstRef = useRef();
    const inputLastRef = useRef();
    const inputPhoneRef = useRef();

    // при переходе в режим редактирования и выделении какого-нибудь контакта —
    // мы должны заполнить поля формы данными этого контакта для редактирования
    useEffect(() => {
        if (selected && editmode) { // изменение контакта
            const contact = contacts.find(item => item.id === selected);
            if (contact) {
                const copy = {...contact};
                delete copy.id;
                setLocalState(copy);
            }
        } else { // добавление контакта
            setLocalState(emptyLocalState);
        }
        // eslint-disable-next-line
    }, [selected, editmode]);

    // когда поле ввода пустое — делаем рамку поля красным, что надо заполнить
    useEffect(() => {
        if (localState.firstName.trim() === '') {
            inputFirstRef.current.style.borderColor = '#F00';
        } else {
            inputFirstRef.current.style.borderColor = '#333';
        }
        if (localState.lastName.trim() === '') {
            inputLastRef.current.style.borderColor = '#F00';
        } else {
            inputLastRef.current.style.borderColor = '#333';
        }
        if (localState.phone.trim() === '') {
            inputPhoneRef.current.style.borderColor = '#F00';
        } else {
            inputPhoneRef.current.style.borderColor = '#333';
        }
    }, [localState]);

    const handleChange = (event) => {
        setLocalState({
            ...localState,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (hasError()) return;

        if (selected && editmode) { // изменение контакта
            dispatch({
                type: Types.UPDATE,
                payload: localState,
            });
        } else { // добавление контакта
            dispatch({
                type: Types.APPEND,
                payload: localState,
            });
            setLocalState(emptyLocalState);
        }
    }

    const hasError = () => {
        let error = false;
        if (localState.firstName.trim() === "") {
            error = true;
        }
        if (localState.lastName.trim() === "") {
            error = true;
        }
        if (localState.phone.trim() === "") {
            error = true;
        }
        return error;
    }

    const inputStyle = {
        margin: 10,
        padding: 10,
        backgroundColor: '#FFE',
        border: '1px solid #333',
        borderRadius: 6,
    };

    if (editmode) {
        inputStyle.backgroundColor = '#EFE';
    }

    return (
        <form onSubmit={handleSubmit}>
            {selected && editmode ? (
                <h4>CHANGE CONTACT</h4>
            ) : (
                <h4>APPEND CONTACT</h4>
            )}
            <input
                type="text"
                name="firstName"
                value={localState.firstName}
                onChange={handleChange}
                placeholder="First name"
                style={inputStyle}
                ref={inputFirstRef}
            />
            <input
                type="text"
                name="lastName"
                value={localState.lastName}
                onChange={handleChange}
                placeholder="Last name"
                style={inputStyle}
                ref={inputLastRef}
            />
            <input
                type="text"
                name="phone"
                value={localState.phone}
                onChange={handleChange}
                placeholder="Phone"
                style={inputStyle}
                ref={inputPhoneRef}
            />
            <input type="submit" style={inputStyle} value="SAVE CONTACT" />
        </form>
    )
}