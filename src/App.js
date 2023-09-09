import './App.css';
import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import ModalPago from './components/ModalPago'


function App() {

  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validationSchema = yup.object({
    descripicionPedido: yup
      .string()
      .required('Campo requerido'),
    imagenPedido: yup.mixed()
      .test('fileSize', 'La imagen es demasiado grande (Se permite hasta 5 MB)', (value) => {
        if (value) {
          return value.size <= 5000000; // 5MB
        }
        return true;
      })
      .test('fileType', 'Formato de imagen no válido (Sólo se permite formato JPG)', (value) => {
        if (value) {
          return ['image/jpeg'].includes(value.type);
        }
        return true;
      }),
    ciudadComercio: yup
      .string()
      .required('Campo requerido'),
    calleComercio: yup
      .string()
      .required('Campo requerido'),
    nroComercio: yup
      .string()
      .required('Campo requerido'),
    ciudadEntrega: yup
      .string()
      .required('Campo requerido'),
    calleEntrega: yup
      .string()
      .required('Campo requerido'),
    nroEntrega: yup
      .string()
      .required('Campo requerido'),
  });

  const formik = useFormik({
    initialValues: {
      descripicionPedido: 'Pedido',
      imagenPedido: '',
      ciudadComercio: '1',
      calleComercio: 'Lima',
      nroComercio: '156',
      referenciaComercio: '',
      ciudadEntrega: '2',
      calleEntrega: 'Colon',
      nroEntrega: '456',
      referenciaEntrega: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      values.subtotal = Math.floor(Math.random() * 100) + 1;
      setPedidos([values]);
      resetForm();
    },
  });

  const calcularTotal = () => {
    return pedidos.reduce((total, valor) => {
      return total + valor.subtotal;
    }, 0);
  };

  return (
    <div>
      <h1>Realizar Pedido de “lo que sea”</h1>
      <form onSubmit={formik.handleSubmit}>
        <h2>Descripción del producto</h2>
        <TextField
          fullWidth
          id="descripicionPedido"
          name="descripicionPedido"
          label="Descripicion del Pedido"
          value={formik.values.descripicionPedido}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.descripicionPedido && Boolean(formik.errors.descripicionPedido)}
          helperText={formik.touched.descripicionPedido && formik.errors.descripicionPedido}
        />
        <FormControl fullWidth>
          <Input
            type="file"
            id="imagenPedido"
            name="imagenPedido"
            onChange={(event) => {
              console.log(event.currentTarget.files[0]);
              formik.setFieldValue('imagenPedido', event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.imagenPedido && Boolean(formik.errors.imagenPedido)}
          />
          {formik.touched.imagenPedido && formik.errors.imagenPedido && (
            <FormHelperText error>{formik.errors.imagenPedido}</FormHelperText>
          )}
        </FormControl>

        <h2>Dirección del comercio</h2>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="ciudadComercio">Seleccione Ciudad</InputLabel>
          <Select
            id="ciudadComercio"
            name="ciudadComercio"
            label="Seleccione Ciudad"
            value={formik.values.ciudadComercio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ciudadComercio && Boolean(formik.errors.ciudadComercio)}
          >
            <MenuItem value="1">Carlos Paz</MenuItem>
            <MenuItem value="2">Córdoba</MenuItem>
            <MenuItem value="3">Unquillo</MenuItem>
          </Select>
          {formik.touched.ciudadComercio && formik.errors.ciudadComercio && (
            <div className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1wc848c-MuiFormHelperText-root">{formik.errors.ciudadComercio}</div>)}
        </FormControl>
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="calleComercio"
          name="calleComercio"
          label="Ingrese calle"
          value={formik.values.calleComercio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.calleComercio && Boolean(formik.errors.calleComercio)}
          helperText={formik.touched.calleComercio && formik.errors.calleComercio}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="nroComercio"
          name="nroComercio"
          label="Ingrese numeración"
          value={formik.values.nroComercio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nroComercio && Boolean(formik.errors.nroComercio)}
          helperText={formik.touched.nroComercio && formik.errors.nroComercio}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="referenciaComercio"
          name="referenciaComercio"
          label="Ingrese una referencia"
          value={formik.values.referenciaComercio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <h2>Dirección de entrega</h2>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="ciudadEntrega">Seleccione ciudad</InputLabel>
          <Select
            id="ciudadEntrega"
            name="ciudadEntrega"
            label="Seleccione Ciudad"
            value={formik.values.ciudadEntrega}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ciudadEntrega && Boolean(formik.errors.ciudadEntrega)}
          >
            <MenuItem value="1">Carlos Paz</MenuItem>
            <MenuItem value="2">Córdoba</MenuItem>
            <MenuItem value="3">Unquillo</MenuItem>
          </Select>
          {formik.touched.ciudadEntrega && formik.errors.ciudadEntrega && (
            <div className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1wc848c-MuiFormHelperText-root">{formik.errors.ciudadEntrega}</div>)}
        </FormControl>
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="calleEntrega"
          name="calleEntrega"
          label="Ingrese calle"
          value={formik.values.calleEntrega}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.calleEntrega && Boolean(formik.errors.calleEntrega)}
          helperText={formik.touched.calleEntrega && formik.errors.calleEntrega}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="nroEntrega"
          name="nroEntrega"
          label="Ingrese numeración"
          value={formik.values.nroEntrega}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nroEntrega && Boolean(formik.errors.nroEntrega)}
          helperText={formik.touched.nroEntrega && formik.errors.nroEntrega}
        />
        <br></br>
        <br></br>
        <TextField
          fullWidth
          id="referenciaEntrega"
          name="referenciaEntrega"
          label="Ingrese una referencia"
          value={formik.values.referenciaEntrega}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <br></br>
        <br></br>
        <Button color="primary" variant="contained" fullWidth type="submit">
          Confirmar pedido
        </Button>
        <br></br>
        <br></br>
      </form>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Poducto</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.descripicionPedido}</TableCell>
                <TableCell>
                  {(row.imagenPedido !== "") ? (
                    <img src={URL.createObjectURL(row.imagenPedido)} alt="Imagen subida" width="100" height="100" />)
                    : <p>Sin Imagen</p>
                  }
                </TableCell>
                <TableCell>${row.subtotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <h2>Total a pagar: ${calcularTotal()}</h2>
      <Button color="secondary" variant="contained"  disabled={pedidos.length === 0} fullWidth onClick={handleOpenModal}>Pagar</Button>      
      {modalOpen && (
        <ModalPago open={modalOpen} onClose={handleCloseModal} totalApagar={calcularTotal()} />
      )}
      <br></br>
      <br></br>
    </div>);
}

export default App;
