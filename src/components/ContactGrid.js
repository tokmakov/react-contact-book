import { useContact, Types } from './ContactContext';
import './ContactGrid.css';

function ContactItem({ contact, selected, editmode, onClick }) {
    const { firstName, lastName, phone } = contact;
    const src = `https://cataas.com/cat?${firstName}${lastName}`;
    const className = `contact-item ${selected && editmode ? 'contact-selected' : ''}`;

    return (
        <div className={className} onClick={onClick}>
            <img src={src} alt="Contact avatar" />
            <div>{firstName} {lastName}</div>
            <div>{phone}</div>
        </div>
    );
}

export function ContactGrid() {
    const [state, dispatch] = useContact();
    const { contacts, selected, editmode } = state;

    const selectContact = (id) => {
        if (editmode) {
            dispatch({
                type: Types.SELECT,
                payload: { id },
            });
        }
    };

    return (
        <div className="contact-grid">
            {contacts.map((contact) => (
                <ContactItem
                    key={contact.id}
                    contact={contact}
                    selected={selected === contact.id}
                    editmode={selected === contact.id && editmode}
                    onClick={() => selectContact(contact.id)}
                />
            ))}
        </div>
    );
}
