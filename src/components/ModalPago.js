import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ModalConfirmacionPago from './ModalConfirmacionPago';
import { FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const ModalPago = ({ open, onClose, totalApagar }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [value, setValue] = React.useState();
    const [startDate, setStartDate] = React.useState(dayjs('2023-09-6T21:11:54'));
    const [selectedEnvio, setSelectedEnvio] = useState("antesPosible");
    const [selectedFormaPago, setSelectedFormaPago] = useState("efectivo");
    const [texto, setTexto] = useState('');
    const [nroTarjeta, setNroTarjeta] = useState('');
    const [tarjetaValida, setTarjetaValida] = useState('');
   
    const handleInputChange = (event) => {
        const nuevoTexto = event.target.value;
        let empresa;
        empresa = mostrarEmpresaTarjeta(nuevoTexto);
        setTexto(empresa);
        setNroTarjeta(nuevoTexto);
    };

    const handleValidar = () => {
        if (validarTarjeta(nroTarjeta))
            setTarjetaValida("");
        else
            setTarjetaValida("Tarjeta Invalida");
    };

    const handleRadioEnvio = (event) => {
        setSelectedEnvio(event.target.value);
    };

    const handleRadioFormaPago = (event) => {
        setSelectedFormaPago(event.target.value);
    };

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    function mostrarEmpresaTarjeta(numeroTarjeta) {
        let primerosDigitos = numeroTarjeta.slice(0, 6);
        let empresas = {
            '4': 'Visa',
            '51': 'MasterCard',
            '52': 'MasterCard',
            '53': 'MasterCard',
            '54': 'MasterCard',
            '55': 'MasterCard',
            '34': 'American Express',
            '37': 'American Express',
            '6011': 'Discover',
        };

        for (let prefijo in empresas) {
            if (primerosDigitos.startsWith(prefijo)) {
                return `${empresas[prefijo]}`;
            }
        }
    }

    function validarTarjeta(numeroTarjeta) {
        numeroTarjeta = numeroTarjeta.replace(/\s/g, '').replace(/[^0-9]/g, '');

        if (numeroTarjeta.length < 13 || numeroTarjeta.length > 19) {

            return false;
        }

        // Aplicar el algoritmo de Luhn (módulo 10)
        let digitos = numeroTarjeta.split('').map(Number);
        let suma = 0;
        let reverse = digitos.reverse();

        for (let i = 0; i < reverse.length; i++) {
            if (i % 2 === 1) {
                let doubleDigit = reverse[i] * 2;
                suma += doubleDigit < 10 ? doubleDigit : doubleDigit - 9;
            } else {
                suma += reverse[i];
            }
        }

        if (suma % 10 !== 0) {
            return false;
        }

        return true;
    }

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
                        defaultValue="antesPosible"
                        onChange={handleRadioEnvio}
                    >
                        <FormControlLabel value="antesPosible" control={<Radio />} label="Lo antes posible" />
                        <FormControlLabel value="fechaPersonalizada" control={<Radio />} label="Fecha personalizada" />
                    </RadioGroup>
                </FormControl>
                {selectedEnvio === 'fechaPersonalizada' && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DateTimePicker
                                label="Fecha y hora de entrega"
                                minDate={startDate}
                                value={value}
                                onChange={(newValue) => {
                                    setStartDate(newValue);
                                  }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>
                )}
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">¿Cómo lo vas a pagar?</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="efectivo"
                        onChange={handleRadioFormaPago}
                    >
                        <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
                        <FormControlLabel value="tarjeta" control={<Radio />} label="Tarjeta débito/crédito" />
                    </RadioGroup>
                </FormControl>
                {selectedFormaPago === 'efectivo' && (
                    <FormControl fullWidth>
                        <InputLabel htmlFor="pagoEfectivo">Ingrese el monto con el que va a pagar</InputLabel>
                        <OutlinedInput
                            id="pagoEfectivo"
                            name="pagoEfectivo"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Ingrese el monto con el que va a pagar"
                        />
                    </FormControl>)}
                {selectedFormaPago === 'tarjeta' && (
                    <FormControl fullWidth>
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
                            onChange={handleInputChange}
                        />
                        <h2>{texto}</h2>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack spacing={3}>
                                <DesktopDatePicker
                                    label="Fecha de vencimiento"
                                    inputFormat="yyyy"
                                    value={value}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                        <TextField
                            fullWidth
                            id="cvv"
                            name="cvv"
                            label="Número de cvv"
                        />
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <p>{tarjetaValida} </p>
                <Button onClick={handleOpenModal} color="primary">
                    Confirmar Pago
                </Button>
            </DialogActions>
            <ModalConfirmacionPago open={modalOpen} onClose={onClose} />
        </Dialog>
    );
};

export default ModalPago;
