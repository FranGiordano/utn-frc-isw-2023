import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ModalConfirmacionPago from './ModalConfirmacionPago';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';

const ModalPago = ({ open, onClose, totalApagar }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [value, setValue] = React.useState();
    const [texto, setTexto] = useState('');

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const validationSchema = yup.object({
        fechaPersonalizada: yup.date()
            .required("Campo requerido")
            .when('recibirPedido', ([recibirPedido], schema) => {
                if (recibirPedido === 'antesPosible') {
                    return schema.notRequired();
                }
            }),
        efectivo: yup.number()
            .typeError("Debe ingresar un número")
            .required("Campo requerido")
            .test({
                test: function (value) {
                    if (value < totalApagar) {
                        return false;
                    }
                    return true;
                }
            })
            .when('paymentMethod', ([paymentMethod], schema) => {
                if (paymentMethod === 'tarjeta') {
                    return schema.notRequired();
                }
            }),
        nombreTitular: yup.string()
            .required("Campo requerido")
            .when('paymentMethod', ([paymentMethod], schema) => {
                if (paymentMethod === 'efectivo') {
                    return schema.notRequired();
                }
            }),
        numeroTarjeta: yup.mixed()
            .required("Campo requerido")
            .test({
                test: function (value) {
                    setTexto(mostrarEmpresaTarjeta(value));
                    if (this.parent.paymentMethod === "tarjeta")
                        return validarTarjeta(value);
                    return true;
                }
            })
            .when('paymentMethod', ([paymentMethod], schema) => {
                if (paymentMethod === 'efectivo') {
                    return schema.notRequired();
                }
                setTexto(mostrarEmpresaTarjeta(value));
            }),
        fechaVencimiento: yup.date()
            .required("Campo requerido")
            .when('paymentMethod', ([paymentMethod], schema) => {
                if (paymentMethod === 'efectivo') {
                    return schema.notRequired();
                }
            }),
        cvv: yup.number()
            .typeError("Debe ingresar un número")
            .required("Campo requerido")
            .when('paymentMethod', ([paymentMethod], schema) => {
                if (paymentMethod === 'efectivo') {
                    return schema.notRequired();
                }
            }),
    });

    const formik = useFormik({
        initialValues: {
            recibirPedido: 'antesPosible',
            fechaPersonalizada: dayjs(new Date()),
            paymentMethod: 'efectivo',
            efectivo: '',
            nombreTitular: '',
            numeroTarjeta: '',
            fechaVencimiento: dayjs(new Date()),
            cvv: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            handleOpenModal();
        },
    });

    function mostrarEmpresaTarjeta(numeroTarjeta) {
        if (!numeroTarjeta)
            return "";
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

        if (!numeroTarjeta)
            return false;

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
                            name="recibirPedido"
                            value={formik.values.recibirPedido}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="antesPosible" control={<Radio />} label="Lo antes posible" />
                            <FormControlLabel value="fechaPersonalizada" control={<Radio />} label="Fecha personalizada" />
                        </RadioGroup>
                    </FormControl>
                    {formik.values.recibirPedido === 'fechaPersonalizada' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack style={{ marginTop: '10px' }} spacing={3}>
                                <DateTimePicker
                                    id="fechaPersonalizada"
                                    name="fechaPersonalizada"
                                    label="Fecha y hora de entrega"
                                    value={formik.values.fechaPersonalizada}
                                    onChange={(value) => formik.setFieldValue('fechaPersonalizada', value)}
                                    error={formik.touched.fechaPersonalizada && Boolean(formik.errors.fechaPersonalizada)}
                                    minDate={formik.values.fechaPersonalizada}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                {formik.touched.fechaPersonalizada && formik.errors.fechaPersonalizada && (
                                    <FormHelperText error style={{ marginLeft: '15px', marginTop: '5px' }}>{formik.errors.fechaPersonalizada}</FormHelperText>
                                )}
                            </Stack>
                        </LocalizationProvider>
                    )}
                    <FormControl >
                        <FormLabel style={{ marginTop: '15px' }} id="demo-row-radio-buttons-group-label">¿Cómo lo vas a pagar?</FormLabel>
                        <RadioGroup
                            style={{ marginTop: '10px' }}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="paymentMethod"
                            value={formik.values.paymentMethod}
                            onChange={formik.handleChange}
                        >
                            <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
                            <FormControlLabel value="tarjeta" control={<Radio />} label="Tarjeta débito/crédito" />
                        </RadioGroup>
                    </FormControl>
                    {formik.values.paymentMethod === 'efectivo' && (
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
                            {formik.touched.efectivo && formik.errors.efectivo && (
                                <FormHelperText error>{formik.errors.efectivo}</FormHelperText>
                            )}
                        </FormControl>)}
                    {formik.values.paymentMethod === 'tarjeta' && (
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

                            <Grid container spacing={2}>
                                <Grid item style={{ width: "60%" }}>
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
                                </Grid>
                                <Grid item>
                                    {texto && (<h2 style={{ margin: "0px" }}>{texto}</h2>)}
                                </Grid>
                            </Grid>




                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Stack style={{ marginBottom: '16px' }} spacing={3}>
                                    <DesktopDatePicker
                                        style={{ marginBottom: '16px' }}
                                        label="Fecha de vencimiento"
                                        id="fechaVencimiento"
                                        name="fechaVencimiento"
                                        value={formik.values.fechaVencimiento}
                                        minDate={formik.values.fechaVencimiento}
                                        onChange={(value) => formik.setFieldValue('fechaVencimiento', value)}
                                        error={formik.touched.fechaVencimiento && Boolean(formik.errors.fechaVencimiento)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    {formik.touched.fechaVencimiento && formik.errors.fechaVencimiento && (
                                        <FormHelperText error style={{ marginLeft: '15px', marginTop: '5px' }}>{formik.errors.fechaVencimiento}</FormHelperText>
                                    )}
                                </Stack>
                            </LocalizationProvider>
                            <TextField
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
