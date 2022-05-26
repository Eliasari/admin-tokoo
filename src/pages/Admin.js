import React from "react"
import Navbar from "../component/Navbar"
import axios from "axios"
import { base_url } from "../component/Config"
import $ from "jquery"

export default class Admin extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            action: "",
            admins: [],
            idPegawai: "",
            namaPegawai: "",
            alamatPegawai: "",
            email: "",
            password: "",
            fillPassword: true
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
    }
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }
    getAdmins = () => {
        let url = base_url + "/getPegawai"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ admins: response.data.pegawai })
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
        this.getAdmins()
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">Admin List</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>email</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.admins.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.namaPegawai}</td>
                                    <td>{item.alamatPegawai}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info m-1"
                                            onClick={() => this.Edit(item)}>
                                            Edit
                                        </button>

                                        <button className="btn btn-sm btn-danger m-1"
                                            onClick={() => this.dropAdmin(item)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="btn btn-success" onClick={() => this.Add()}>
                        Add Admin
                    </button>
                    {/* modal admin  */}
                    <div className="modal" id="modal_admin">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header bg-info text-white">
                                    <h4>Form Admin</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => this.saveAdmin(ev)}>
                                        Admin Name
                                        <input type="text" className="form-control mb-1"
                                            value={this.state.namaPegawai}
                                            onChange={ev => this.setState({ namaPegawai: ev.target.value })}
                                            required
                                        />

                                        Address
                                        <input type="text" className="form-control mb-1"
                                            value={this.state.alamatPegawai}
                                            onChange={ev => this.setState({ alamatPegawai: ev.target.value })}
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
            </div>
        )
    }
    Add = () => {
        $("#modal_admin").show()
        this.setState({
            action: "insert",
            idPegawai: 0,
            namaPegawai: "",
            alamatPegawai: "",
            email: "",
            password: "",
            fillPassword: true,
        })
    }
    Edit = selectedItem => {
        $("#modal_admin").show()
        this.setState({
            action: "update",
            idPegawai: selectedItem.idPegawai,
            namaPegawai: selectedItem.namaPegawai,
            alamatPegawai: selectedItem.alamatPegawai,
            email: selectedItem.email,
            password: "",
            fillPassword: false,
        })
    }
    saveAdmin = event => {
        event.preventDefault()
        $("#modal_admin").hide()
        let form = {
            idPegawai: this.state.idPegawai,
            namaPegawai: this.state.namaPegawai,
            alamatPegawai: this.state.alamatPegawai,
            email: this.state.email
        }

        if (this.state.fillPassword) {
            form.password = this.state.password
        }


        if (this.state.action === "insert") {
            let url = base_url + "/addPegawai"
            axios.post(url, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getAdmins()
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "update") {
            let url2 = base_url + "/updatePegawai"
            axios.put(url2, form, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getAdmins()
                })
                .catch(error => console.log(error))
        }
    }
    dropAdmin = selectedItem => {
        if (window.confirm("are you sure will delete this item?")) {
            let url = base_url + "/dropPegawai/" + selectedItem.idPegawai
            axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getAdmins()
                })
                .catch(error => console.log(error))
        }
    }

}
