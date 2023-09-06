import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ModalConfirmacionPago from './ModalConfirmacionPago';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const ModalPago = ({ open, onClose, totalApagar }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Realizar Pago</DialogTitle>
            <DialogContent>
                <h2>Total a pagar: ${totalApagar}</h2>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">¿Cuándo quieres recibir el pedido?</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="female" control={<Radio />} label="Lo antes posible" />
                        <FormControlLabel value="male" control={<Radio />} label="Fecha personalizada" />
                    </RadioGroup>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                        <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="MM/DD/YYYY"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">¿Cómo lo vas a pagar?</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="female" control={<Radio />} label="Efectivo" />
                        <FormControlLabel value="male" control={<Radio />} label="Tarjeta débito/crédito" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    fullWidth
                    id="pagoEfectivo"
                    name="pagoEfectivo"
                    label="Ingrese el monto con el que va a pagar"
                />
                <TextField
                    fullWidth
                    id="nomTitular"
                    name="nomTitular"
                    label="Nombre del titular de la tarjeta"
                />
                <TextField
                    fullWidth
                    id="nroTarjeta"
                    name="nroTarjeta"
                    label="Número de la tarjeta"
                />
                <TextField
                    fullWidth
                    id="fecheVencimiento"
                    name="fecheVencimiento"
                    label="Fecha de vencimiento de la tarjeta"
                />
                <TextField
                    fullWidth
                    id="cvv"
                    name="cvv"
                    label="Número de cvv"
                />
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
