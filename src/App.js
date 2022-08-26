import React, { Component, useState } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Select from 'react-select'


const urlAPI = "http://localhost:61301/api/CatalogoProductos";


const ddlTipBusqueda = [
  { name: 'TipBusqueda', value: '', label: 'Seleccione..' },
  { name: 'TipBusqueda', value: 'Nombre', label: 'Nombre' },
  { name: 'TipBusqueda', value: 'Descripcion', label: 'Descripcion' },
  { name: 'TipBusqueda', value: 'Categoria', label: 'Categoria' }
]


const ddlOrdenDesendente = [
  { name: 'OrdenDesendente', value: '', label: 'Seleccione..' },
  { name: 'OrdenDesendente', value: 'false', label: 'Acendente' },
  { name: 'OrdenDesendente', value: 'true', label: 'Descendente' }
]


class App extends Component {


  state = {
    data: [],
    modalInsertUpda: false,
    modalEliminar: false,
    form: {
      Id_CatPro: '',
      Nombre_CatPro: '',
      DescripcionBreve_CatPro: '',
      Categoria_CatPro: '',
      ImagenProducto_CatPro: '',
      tipoModal: ''
    },
    file: null,
    flag: false,
    FilProducto: {
      TipBusqueda: '',
      ValorBusqueda: '',
      OrdenDesendente: ''
    }
  }


  peticionGet = () => {
    axios.get(urlAPI).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionGetParametro = () => {
    if (this.state.FilProducto.TipBusqueda === '' || this.state.FilProducto.ValorBusqueda === '' || this.state.FilProducto.OrdenDesendente === '') {
      alert("Campos requeridos");
      return;
    }
    axios.get(urlAPI + '?TipBusqueda=' + this.state.FilProducto.TipBusqueda + '&ValorBusqueda=' + this.state.FilProducto.ValorBusqueda + '&OrdenDesendente=' + this.state.FilProducto.OrdenDesendente).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionPost = async () => {
    if (this.state.form === null) {
      alert("Campos requeridos");
      return;
    }
    if (this.state.form.Nombre_CatPro === '' || this.state.form.DescripcionBreve_CatPro === '' || this.state.form.Categoria_CatPro === '' || this.state.form.ImagenProducto_CatPro === '') {
      alert("Campos requeridos");
      return;
    }
    this.state.form.ImagenProducto_CatPro = this.state.file;
    await axios.post(urlAPI, this.state.form).then(response => {
      this.modalInsertUpda();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionPut = () => {
    if (this.state.form.Id_CatPro === '' || this.state.form.Nombre_CatPro === '' || this.state.form.DescripcionBreve_CatPro === '' || this.state.form.Categoria_CatPro === '' || this.state.form.ImagenProducto_CatPro === '') {
      alert("Campos requeridos");
      return;
    }

    this.state.form.ImagenProducto_CatPro = this.state.file;
    axios.put(urlAPI + '/' + this.state.form.Id_CatPro, this.state.form).then(response => {
      this.modalInsertUpda();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionDelete = () => {
    axios.delete(urlAPI + '/' + this.state.form.Id_CatPro).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }


  componentDidMount() {
    this.peticionGet();
  }


  modalInsertUpda = () => {
    this.setState({ modalInsertUpda: !this.state.modalInsertUpda });
  }


  handleChange = async e => {
    console.log("handleChange", e);
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  }


  handleChangeFilProducto = async e => {
    console.log("handleChange", e);
    e.persist();
    await this.setState({
      FilProducto: {
        ...this.state.FilProducto,
        [e.target.name]: e.target.value
      }
    });
  }


  handleChangeSelect = async e => {
    console.log("handleChangeSelect", e);

    await this.setState({
      FilProducto: {
        ...this.state.FilProducto,
        [e.name]: e.value
      }
    });
  }


  fileChangedHandler = (event) => {
    let reader = new FileReader();
    reader.onload = () => this.setState({ file: reader.result, flag: true })
    reader.readAsDataURL(event.target.files[0]);
  };


  seleccionarProducto = (producto) => {
    this.setState({
      tipoModal: 'actualizar',
      file: producto.ExtImagProd_CatPro + ',' + producto.ImagenProducto_CatPro,
      flag: true,
      form: {
        Id_CatPro: producto.Id_CatPro,
        Nombre_CatPro: producto.Nombre_CatPro,
        DescripcionBreve_CatPro: producto.DescripcionBreve_CatPro,
        Categoria_CatPro: producto.Categoria_CatPro,
        ImagenProducto_CatPro: producto.ImagenProducto_CatPro,
      }
    })
  }


  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <div>
          <div>
            <label htmlFor="TipBusqueda" className="form-label">Tipo de busqueda</label>
            <Select name="TipBusqueda" id="TipBusqueda" options={ddlTipBusqueda} onChange={this.handleChangeSelect} />
          </div>
          <div>
            <label htmlFor="ValorBusqueda" className="form-label">Nombre</label>
            <input onChange={this.handleChangeFilProducto} type="text" name="ValorBusqueda" id="ValorBusqueda" className="form-control"></input>
          </div>
          <div>
            <label htmlFor="OrdenDesendente" className="form-label">Orden de busqueda</label>
            <Select name="OrdenDesendente" id="OrdenDesendente" options={ddlOrdenDesendente} onChange={this.handleChangeSelect} />
          </div>
          <br />

          <button className="btn btn-success" onClick={() => this.peticionGetParametro()}>
            Consultar
          </button>
        </div>
        <br />
        <br />
        <button className="btn btn-success" onClick={() => { this.setState({ file: null, form: null, tipoModal: 'insertar' }); this.modalInsertUpda() }}>
          Agregar Producto
        </button>
        <br />
        <br />
        <table className="table table-sm">
          <thead className="thead-bla">
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Descripcion Breve</th>
              <th>Categoria</th>
              <th>Imagen Producto</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.Dato && this.state.data.Dato.map(producto => {
              return (
                <tr key={producto.Id_CatPro}>
                  <td>{producto.Id_CatPro}</td>
                  <td>{producto.Nombre_CatPro}</td>
                  <td>{producto.DescripcionBreve_CatPro}</td>
                  <td>
                    <img src={producto.ExtImagProd_CatPro + ',' + producto.ImagenProducto_CatPro}
                      alt={""} width="190" height="220" text-align="left" style={{ display: "block" }} />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarProducto(producto); this.modalInsertUpda() }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarProducto(producto); this.setState({ modalEliminar: true }) }} >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertUpda}>
          <ModalHeader style={{ display: 'block' }}>
            {
              this.state.tipoModal == 'insertar' ?
                <label className="form-label">
                  Agregar producto
                </label>
                :
                <label className="form-label">
                  Modificar producto
                </label>
            }
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="Nombre_CatPro" className="form-label">
                Nombre
              </label>
              <input type="text" name="Nombre_CatPro" id="Nombre_CatPro" className="form-control" onChange={this.handleChange} value={form ? form.Nombre_CatPro : ''}>
              </input>
              <label htmlFor="DescripcionBreve_CatPro" className="form-label">
                Descripcion Breve
              </label>
              <input type="text" name="DescripcionBreve_CatPro" id="DescripcionBreve_CatPro" className="form-control" onChange={this.handleChange} value={form ? form.DescripcionBreve_CatPro : ''}>
              </input>
              <label htmlFor="Categoria_CatPro" className="form-label">
                Categoria
              </label>
              <input type="text" name="Categoria_CatPro" id="Categoria_CatPro" className="form-control" onChange={this.handleChange} value={form ? form.Categoria_CatPro : ''}>
              </input>
              <div id="modeling">
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <div className="modeling-text">
                      </div>
                    </div>
                  </div>
                  {
                    this.state.flag ?
                      <img src={this.state.file} alt={""} width="190"
                        height="220" text-align="left" style={{ display: "block" }} />
                      :
                      <img src="./Image_Placeholder.jpg" alt={""} width="190"
                        height="220" text-align="left" style={{ display: "block" }} />
                  }

                </div>
                <div className="input-group mt-1 offset-1">
                  <div className="custom-file smaller-input">
                    <input type="file" className="custom-file-input" name="file" inputprops={{ accept: "image/*" }}
                      accept=".png,.jpg,.jpeg" onChange={this.fileChangedHandler} id="inputGroupFile01" />
                    <label className="custom-file-label" htmlFor="inputGroupFile01">
                      Elige tu imagen
                    </label>
                    <i className="bi bi-cloud-upload">
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            {
              this.state.tipoModal == 'insertar' ?
                <button className="btn btn-success" onClick={() => this.peticionPost()}>
                  Insertar
                </button>
                :
                <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                  Actualizar
                </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertUpda()}>Cancelar</button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar a el producto {form && form.Nombre_CatPro}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>
              Sí
            </button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default App;
