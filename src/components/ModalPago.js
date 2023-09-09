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
import { useFormik } from 'formik';
import * as yup from 'yup';

const ModalPago = ({ open, onClose, totalApagar }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [value, setValue] = React.useState();
    const [startDate, setStartDate] = React.useState(dayjs(new Date()));
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

    const validationSchema = yup.object({

        efectivo: yup
            .number()
            .required('Campo requerido'),
        nombreTitular: yup
            .string()
            .required('Campo requerido'),
        numeroTarjeta: yup
            .number()
            .required('Campo requerido'),
        cvv: yup
            .number()
            .required('Campo requerido')
    });

    const formik = useFormik({
        initialValues: {
            efectivo: '',
            nombreTitular: '',
            numeroTarjeta: '',
            cvv: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            //   resetForm();
            console.log(values)
        },
    });


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
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <h2>Total a pagar: ${totalApagar}</h2>
                    <FormControl>
                        <FormLabel style={{ marginBottom: '10px' }} id="demo-row-radio-buttons-group-label">¿Cuándo quieres recibir el pedido?</FormLabel>
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
                            <Stack style={{ marginTop: '10px' }} spacing={3}>
                                <DateTimePicker
                                    id="fechaPersonalizada"
                                    name="fechaPersonalizada"
                                    label="Fecha y hora de entrega"
                                    minDate={startDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Stack>
                        </LocalizationProvider>
                    )}
                    <FormControl >
                        <FormLabel style={{ marginTop: '15px' }} id="demo-row-radio-buttons-group-label">¿Cómo lo vas a pagar?</FormLabel>
                        <RadioGroup
                            style={{ marginTop: '10px' }}
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
                        <FormControl style={{ marginTop: '15px' }} fullWidth>
                            <InputLabel htmlFor="efectivo">Ingrese el monto con el que va a pagar</InputLabel>
                            <OutlinedInput
                                id="efectivo"
                                name="efectivo"
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Ingrese el monto con el que va a pagar"
                                value={formik.values.efectivo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.efectivo && Boolean(formik.errors.efectivo)}
                            />
                        </FormControl>)}
                    {selectedFormaPago === 'tarjeta' && (
                        <FormControl style={{ marginTop: '15px' }} fullWidth>
                            <TextField
                                fullWidth
                                style={{ marginBottom: '16px' }}
                                id="nombreTitular"
                                name="nombreTitular"
                                label="Nombre del titular de la tarjeta"
                                value={formik.values.nombreTitular}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nombreTitular && Boolean(formik.errors.nombreTitular)}
                                helperText={formik.touched.nombreTitular && formik.errors.nombreTitular}
                            />
                            <TextField
                                style={{ marginBottom: '16px' }}
                                fullWidth
                                id="numeroTarjeta"
                                name="numeroTarjeta"
                                label="Número de tarjeta"
                                value={formik.values.numeroTarjeta}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.numeroTarjeta && Boolean(formik.errors.numeroTarjeta)}
                                helperText={formik.touched.numeroTarjeta && formik.errors.numeroTarjeta}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack style={{ marginBottom: '16px' }} spacing={3}>
                                    <DesktopDatePicker
                                        style={{ marginBottom: '16px' }}
                                        label="Fecha de vencimiento"
                                        id="fechaVencimiento"
                                        value={formik.values.fechaVencimiento}
                                        name="fechaVencimiento"
                                        inputFormat="yyyy"
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Stack>
                            </LocalizationProvider>
                            <TextField
                                style={{ marginBottom: '16px' }}
                                fullWidth
                                id="cvv"
                                name="cvv"
                                label="Número de cvv"
                                value={formik.values.cvv}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                                helperText={formik.touched.cvv && formik.errors.cvv}
                            />
                        </FormControl>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Confirmar pago
                    </Button>
                </DialogActions>
            </form>
            <ModalConfirmacionPago open={modalOpen} onClose={onClose} />
        </Dialog>

    );
};

export default ModalPago;
