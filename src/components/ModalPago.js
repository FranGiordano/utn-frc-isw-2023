import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ModalConfirmacionPago from './ModalConfirmacionPago';

const ModalPago = ({ open, onClose }) => {

    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Pagar</DialogTitle>
            <DialogContent>
                <li>Total a pagar: $$XXX</li>
                <li>Cuando quiere resibirlo? “Lo antes posible” o una fecha/hora de recepción</li>
                <li>Efectivo -- con cuanto va a pagar?</li>
                <li>Tarjeta -- Cargar datos de la tarjeta/validación</li>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOpenModal} color="primary">
                    Confirmar Pago
                </Button>
            </DialogActions>
            <ModalConfirmacionPago open={modalOpen} onClose={onClose} />
        </Dialog>
    );
};

export default ModalPago;
