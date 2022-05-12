import ProductList from "./ProductList"
import { base_url } from "../component/Config"
import $, { error } from "jquery"
import axios from "axios"
import React from "react"
import Navbar from "../component/Navbar"

export default class Product extends React.Component {
    constructor(){
        super()
        this.state = {
            products: [],
            token: "",
            action: "",
            namaProduk: "",
            deskripsiProduk: "",
            hargaProduk: 0,
            fotoProduk: "",
            uploadFile: true,
            idProduk: "",
            selectedItem: null,
        }
        // this.state.product = this.state.products
    
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)
    }
    headerConfig = () => {
        let header = {
            headers : { Authorization : `Bearer ${this.state.token}`}
        }
        return header
    }
    getProduct = () => {
        let url = base_url + "/getProduk";
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({products: response.data.produk})
        })
        .catch(error=>{
            if(error.response){
                if(error.response.status){
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            }else{
                console.log(error);
            }
        })
    }
    componentDidMount(){
        this.getProduct()
    }
    render(){
        return (
            <div>
               <Navbar />
               <div className="container">
                   <h3 className="text-bold text-info mt-2">Product List</h3>
                   <div className="row">
                       { this.state.products.map( item => (
                           <ProductList
                           key = {item.idProduk}
                           namaProduk = {item.namaProduk}
                           deskripsiProduk = {item.deskripsiProduk}
                           hargaProduk = {item.hargaProduk}
                        //    fotoProduk = {item.fotoProduk}
                           fotoProduk={`http://localhost:8000/images/${item.fotoProduk}`}
                           onEdit = {() => this.Edit(item)}
                           onDrop = {() => this.dropProduct(item)}
                            />
                       )) }
                   </div>
                   <button className="btn btn-success" onClick={() => this.Add()}>
                       Add Product
                   </button>
                </div>
 
                 {/* modal product  */}
                 <div className="modal" id="modal_product">
                     <div className="modal-dialog">
                         <div className="modal-content">
                             <div className="modal-header bg-info text-white">
                                 <h4>Form Product</h4>
                             </div>
                             <div className="modal-body">
                                 <form onSubmit={ev => this.saveProduct(ev)}>
                                     Product Name
                                     <input type="text" className="form-control mb-1"
                                     value={this.state.namaProduk}
                                     onChange={ev => this.setState({namaProduk: ev.target.value})}
                                     required
                                     />
 
                                    Deskripsi 
                                     <input type="text" className="form-control mb-1"
                                     value={this.state.deskripsiProduk}
                                     onChange={ev => this.setState({deskripsiProduk: ev.target.value})}
                                     required
                                     />
 
                                    Product Price
                                     <input type="number" className="form-control mb-1"
                                     value={this.state.hargaProduk}
                                     onChange={ev => this.setState({hargaProduk: ev.target.value})}
                                     required
                                     />
 
                                    { this.state.action === "update" && this.state.uploadFile === false ? (
                                        <button className="btn btn-sm btn-dark mb-1 btn-block"
                                        onClick={() => this.setState({uploadFile: true})}>
                                            Change Product Image
                                        </button>
                                    ) : (
                                        <div>
                                            Product Image
                                            <input type="file" className="form-control mb-1"
                                            onChange={ev => this.setState({fotoProduk: ev.target.files[0]})}
                                            
                                            required
                                            />
                                        </div>
                                    ) }
 
                                    <button type="submit" className="btn btn-block btn-success">
                                        Simpan
                                    </button>
                                 </form>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        )
    }
    Add = () => {
        $("#modal_product").show()
        this.setState({
            action: "insert",
            idProduk: 0,
            namaProduk: "",
            deskripsiProduk: "",
            hargaProduk: 0,
            fotoProduk: null,
            uploadFile: true
        })
    }
 
    Edit = selectedItem => {
        $("#modal_product").show()
        this.setState({
            action: "update",
            idProduk: selectedItem.idProduk,
            namaProduk: selectedItem.namaProduk,
            deskripsiProduk: selectedItem.deskripsiProduk,
            hargaProduk: selectedItem.hargaProduk,
            fotoProduk: null,
            uploadFile: false
        })
    }

    saveProduct = event => {
        event.preventDefault()
        $("#modal_product").hide()
        let form = new FormData()
        form.append("idProduk", this.state.idProduk)
        form.append("namaProduk", this.state.namaProduk)
        form.append("deskripsiProduk", this.state.deskripsiProduk)
        form.append("hargaProduk", this.state.hargaProduk)
        if (this.state.uploadFile) {
            form.append("fotoProduk", this.state.fotoProduk)
        }
 
        
        if (this.state.action === "insert") {
            let url = base_url + "/addProduk";
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        } else {
            let url2 = base_url + "/updateProduk";
            axios.put(url2, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        }
    }

    dropProduct = selectedItem => {
        if (window.confirm("are you sure will delete this item?")) {
            let url= base_url + "/dropProduk/" + selectedItem.idProduk
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        }
    }

}
