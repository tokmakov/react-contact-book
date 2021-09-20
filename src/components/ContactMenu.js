import { useContact, Types } from './ContactContext';

export function ContactMenu() {
    const [state, dispatch] = useContact();
    const { editmode } = state;

    const changeEditMode = () => {
        dispatch({
            type: Types.EDTMOD,
        });
    };

    const removeSelected = () => {
        dispatch({
            type: Types.REMOVE,
        });
    };

    const rollbackChanges = () => {
        dispatch({
            type: Types.ROLLBACK,
        });
    };

    const buttonStyle = {
        margin: 10,
        padding: 10,
        backgroundColor: '#FFF',
        border: '1px solid #333',
        borderRadius: 6,
    };

    const removeButtonStyle = {...buttonStyle};
    const rollbackButtonStyle = {...buttonStyle};

    const onoffButtonStyle = {...buttonStyle};
    if (editmode) {
        onoffButtonStyle.backgroundColor = '#EFE';
    }

    return (
        <div>
            <button style={onoffButtonStyle} onClick={changeEditMode}>
                EDIT MODE (ON|OFF)
            </button>
            {editmode ? (
                <>
                    <button style={removeButtonStyle} onClick={removeSelected}>
                        REMOVE SELECTED
                    </button>
                    <button style={rollbackButtonStyle} onClick={rollbackChanges}>
                        ROLLBACK CHANGES
                    </button>
                </>
            ) : (
                null
            )}
        </div>
    );
}
