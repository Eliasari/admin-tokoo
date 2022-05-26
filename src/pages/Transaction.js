import React from "react"
import Navbar from "../component/Navbar"
import { base_url } from "../component/Config"
import axios from "axios"
import TransactionList from "./TransactionList"

export default class Transaction extends React.Component {
    constructor(){
        super()
        this.state = {
            transaksi: [
                {
                    alamatUser: "Blitar", idTransaksi: 2, 
                    namaUser: "elia", nomorTransaksi: "099888",
                    statusTransaksi: "LUNAS", tanggalTransaksi:"2022-04-17T17:00:00.000Z" 
            }
        ]
            ,
            token: "",
            selectedItem: null
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

    getTransaction = () => {
        
        let url = base_url + "/getTransaksi";
        console.log("ini traksaksi")
 
        axios.get(url, this.headerConfig())
        .then(response => {
            this.setState({transaksi: response.data.transaksi})
            console.log(response.data.transaksi)
            
            // console.log(this.state.transaksi)
            // console.log(response.data.transaksi)
            // console.log(url)
        })
        .catch(error => {
            if (error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            }else{
                console.log(error);
            }
        })
    }
    componentDidMount(){
        this.getTransaction()
    }


    render(){
        return (
            <div>
                <Navbar />
 
                <div className="container">
                    <h3 className="text-bold text-info mt-2">Transactions List</h3>
                    { this.state.transaksi.map((item, index) => (
                        <TransactionList
                        key = {item.idTransaksi}
                        idTransaksi = {item.idTransaksi}
                        namaUser = {item.namaUser}
                        alamatUser = {item.alamatUser}
                        tanggalTransaksi = {item.tanggalTransaksi}
                        // statusTransaksi = {item.statusTransaksi}
                        nomorTransaksi = {item.nomorTransaksi}
                         />
                        // <h1>transaksi</h1>
                    ))}
                </div>
            </div>
        )
    }

}
