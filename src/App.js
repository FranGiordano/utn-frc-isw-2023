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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid
} from '@mui/material';
import ModalPago from './components/ModalPago'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


function App() {

  const [pedidos, setPedidos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [pedido, setPedido] = useState('');


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
      descripicionPedido: '',
      ciudadComercio: '',
      calleComercio: '',
      nroComercio: '',
      referenciaComercio: '',
      ciudadEntrega: '',
      calleEntrega: '',
      nroEntrega: '',
      referenciaEntrega: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setDisabled(true);
      if (values.ciudadComercio === pedido.ciudadComercio &&
          values.calleComercio === pedido.calleComercio &&
          values.nroComercio === pedido.nroComercio &&
          values.ciudadEntrega === pedido.ciudadEntrega &&
          values.calleEntrega === pedido.calleEntrega &&
          values.nroEntrega === pedido.nroEntrega)
       setPedidos([values]);  
      else
       calcularTotal(values);
      setPedidos([values]);
    },
  });

  const calcularTotal = (values) => {

    if (values.ciudadComercio === values.ciudadEntrega &&
      values.calleComercio === values.calleEntrega &&
      values.nroComercio === values.nroEntrega) {
      values.total = 0;
      return;
    }
    values.total = Math.floor(Math.random() * 100) + 50;
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].type !== "image/jpeg") {
        alert("Formato de imagen no válido (Sólo se permite formato JPG).");
        break;
      }
      if (files[i].size > 5000000) {
        alert('La imagen es demasiado grande (Se permite hasta 5 MB).');
        break;
      }
      imageArray.push(URL.createObjectURL(files[i]));
    }

    setSelectedImages([...selectedImages, ...imageArray]);
  };

  const handleDelete = (index) => {
    var nuevoArray = selectedImages.filter(function (valor, indice) {
      return indice !== index;
    });
    setSelectedImages(nuevoArray);
  };

  const modificarPedido = () => {
    setDisabled(false);
    setPedido(pedidos[0]);
    pedidos.length = 0
  }

  const eliminarPedido = () => {
    setDisabled(false);
    setPedido([]);
    pedidos.length = 0
    formik.resetForm();
    selectedImages.length = 0;
  }


  return (
    <div className="container">
      <h1>Realizar Pedido de “lo que sea”</h1>
      <form onSubmit={formik.handleSubmit}>
        <h2>Descripción del pedido</h2>
        <TextField
          fullWidth
          id="descripicionPedido"
          name="descripicionPedido"
          label="Ingrese su pedido"
          disabled={disabled}
          value={formik.values.descripicionPedido}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.descripicionPedido && Boolean(formik.errors.descripicionPedido)}
          helperText={formik.touched.descripicionPedido && formik.errors.descripicionPedido}
        />
        <br></br>
        <br></br>
        <FormControl fullWidth>
          <input
            type="file"
            id="imagenPedido"
            name="imagenPedido"
            disabled={disabled}
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="imagenPedido">
            <Button
              disabled={disabled}
              id="imagenPedido"
              name="imagenPedido"
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Subí fotos de tu pedido
            </Button>
          </label>
          {selectedImages.length > 0 && (
            <div>
              <br></br>
              <Grid container spacing={2}>
                {selectedImages.map((imageUrl, index) => (
                  <Grid item xs={2} key={index}>
                    <Button
                      style={{ border: '0px' }}
                      variant="outlined"
                      component="span"
                      color="error"
                      onClick={() => { handleDelete(index) }}
                      startIcon={<HighlightOffIcon color='red' />}
                      disabled={disabled}
                    >
                    </Button>
                    <img src={imageUrl} disabled={disabled} alt={`Imagen ${index}`} width="100%" />
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h2>Dirección del comercio</h2>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="ciudadComercio">Seleccione Ciudad</InputLabel>
              <Select
                id="ciudadComercio"
                disabled={disabled}
                name="ciudadComercio"
                label="Seleccione Ciudad"
                value={formik.values.ciudadComercio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ciudadComercio && Boolean(formik.errors.ciudadComercio)}
              >
                <MenuItem value="Carlos Paz">Carlos Paz</MenuItem>
                <MenuItem value="Córdoba">Córdoba</MenuItem>
                <MenuItem value="Unquillo">Unquillo</MenuItem>
              </Select>
              {formik.touched.ciudadComercio && formik.errors.ciudadComercio && (
                <div className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-1wc848c-MuiFormHelperText-root">{formik.errors.ciudadComercio}</div>)}
            </FormControl>
            <br></br>
            <br></br>
            <TextField
              fullWidth
              id="calleComercio"
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
              name="referenciaComercio"
              label="Ingrese una referencia"
              value={formik.values.referenciaComercio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={6}>
            <h2>Dirección de entrega</h2>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="ciudadEntrega">Seleccione ciudad</InputLabel>
              <Select
                id="ciudadEntrega"
                name="ciudadEntrega"
                disabled={disabled}
                label="Seleccione Ciudad"
                value={formik.values.ciudadEntrega}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ciudadEntrega && Boolean(formik.errors.ciudadEntrega)}
              >
                <MenuItem value="Carlos Paz">Carlos Paz</MenuItem>
                <MenuItem value="Córdoba">Córdoba</MenuItem>
                <MenuItem value="Unquillo">Unquillo</MenuItem>
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
              label="Ingrese una referencia"
              value={formik.values.referenciaEntrega}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>
        <br></br>
        <br></br>
        <Button color="primary" disabled={disabled} variant="contained" fullWidth type="submit">
          Confirmar pedido
        </Button>
        <br></br>
        <br></br>
      </form>
      {!!pedidos.length && (
        <TableContainer component={Paper}>
          <h2>Detalle del pedido</h2>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Pedido</TableCell>
                <TableCell>Imagen/es</TableCell>
                <TableCell>Lo busco en:</TableCell>
                <TableCell>Lo entrego en:</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.descripicionPedido}</TableCell>
                  <TableCell style={{ width: "500px" }}>
                    <Grid container spacing={2}>
                      {(selectedImages.length > 0) ? (selectedImages.map((imageUrl, index) => (
                        <Grid item xs={4} key={index}>
                          <img src={imageUrl} alt={`Imagen ${index}`} width="100%" />
                        </Grid>
                      ))) : <p>Sin imagenes</p>}
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <p>{row.ciudadComercio + ", " + row.calleComercio + " " + row.nroComercio}</p>
                  </TableCell>
                  <TableCell>
                    <p>{row.ciudadEntrega + ", " + row.calleEntrega + " " + row.nroEntrega}</p>
                  </TableCell>
                  <TableCell>
                    <Button style={{marginRight:'10px'}} color="success" variant="contained" onClick={modificarPedido}>
                      Modificar
                    </Button>
                    <Button color="error" variant="contained" onClick={eliminarPedido}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <h2>Total a pagar: ${!pedidos[0]? 0 : pedidos[0].total}</h2>
      <Button color="secondary" variant="contained" disabled={pedidos.length === 0} fullWidth onClick={handleOpenModal}>Pagar</Button>
      {modalOpen && (
        <ModalPago open={modalOpen} onClose={handleCloseModal} totalApagar={pedidos[0]?.total} />
      )}
    </div>);
}

export default App;
