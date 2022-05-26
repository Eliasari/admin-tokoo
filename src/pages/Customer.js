import React from "react"
import Navbar from "../component/Navbar"
import CustomerList from "./CustomerList"
import { base_url } from "../component/Config"
import $, { error } from "jquery"
import axios from "axios"

export default class Customer extends React.Component {
    constructor() {
        super()
        this.state = {
            customers: [],
            token: "",
            action: "",
            idUser: "",
            namaUser: "",
            alamatUser: "",
            email: "",
            password: "",
            fillPassword: true
        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)
    }
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }
    getCustomers = () => {
        let url = base_url + "/getUser";
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ customers: response.data.results })
    
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status) {
                        window.alert(error.response.data.message)
                        this.props.history.push("/login")
                    }
                } else {
                    console.log(error);
                }
            })
    }
    componentDidMount() {
        this.getCustomers()
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">Customer List</h3>
                    <div className="row">
                        {this.state.customers.map(item => (
                            <CustomerList
                                key={item.idUser}
                                namaUser={item.namaUser}
                                alamatUser={item.alamatUser}
                                email={item.email}
                                onEdit={() => this.Edit(item)}
                                onDrop={() => this.dropCustomer(item)}
                            />
                        ))}
                    </div>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Customer
                    </button>
                </div>

                {/* modal customer  */}
                <div className="modal" id="modal_customer">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-info text-white">
                                <h4>Form Customer</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ev => this.saveCustomer(ev)}>
                                    Customer Name
                                    <input type="text" className="form-control mb-1"
                                        value={this.state.namaUser}
                                        onChange={ev => this.setState({ namaUser: ev.target.value })}
                                        required
                                    />
                                    Customer Address
                                    <input type="text" className="form-control mb-1"
                                        value={this.state.alamatUser}
                                        onChange={ev => this.setState({ alamatUser: ev.target.value })}
                                        required
                                    />
                                    Email
                                    <input type="text" className="form-control mb-1"
                                        value={this.state.email}
                                        onChange={ev => this.setState({ email: ev.target.value })}
                                        required
                                    />

                                    {this.state.action === "update" && this.state.fillPassword === false ? (
                                        <button className="btn btn-sm btn-secondary mb-1 btn-block"
                                            onClick={() => this.setState({ fillPassword: true })}>
                                            Change Password
                                        </button>
                                    ) : (
                                        <div>
                                            Password
                                            <input type="password" className="form-control mb-1"
                                                value={this.state.password}
                                                onChange={ev => this.setState({ password: ev.target.value })}
                                                required
                                            />
                                        </div>
                                    )}
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
        $("#modal_customer").show()
        this.setState({
            action: "insert",
            idUser: 0,
            namaUser: "",
            alamatUser: "",
            email: "",
            password: "",
            fillPassword: true
        })
    }


    Edit = selectedItem => {
        $("#modal_customer").show()
        this.setState({
            action: "update",
            idUser: selectedItem.idUser,
            namaUser: selectedItem.namaUser,
            alamatUser: selectedItem.alamatUser,
            email: selectedItem.email,
            password: "",
            fillPassword: false,
        })
    }
    saveCustomer = event => {
        event.preventDefault()
        $("#modal_customer").hide()
        let form = {
            idUser: this.state.idUser,
            namaUser: this.state.namaUser,
            alamatUser: this.state.alamatUser,
            email: this.state.email
        }
        // let form = new FormData()
        // form.append("idUser", this.state.idUser)
        // form.append("namaUser", this.state.namaUser)
        // form.append("alamatUser", this.state.alamatUser)
        // form.append("email", this.state.email)
        if (this.state.fillPassword) {
            form.password = this.state.password
        }


        if (this.state.action === "insert") {
            let url = base_url + "/addUser";
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getCustomers()
                })
                .catch(error => console.log(error))
        } else {
            let url2 = base_url + "/updateUser";
            axios.put(url2, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getCustomers()
                })
                .catch(error => console.log(error))
        }
    }
    dropCustomer = selectedItem => {
        if(window.confirm("are you sure will delete this item?")){
            let url = base_url + "/dropUser/" + selectedItem.idUser
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getCustomers()
            })
            .catch(error => console.log(error))
        }
    }
}
