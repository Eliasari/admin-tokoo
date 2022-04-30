import React from "react"
import Navbar from "../component/Navbar"
import axios from "axios"
import { base_url } from "../component/Config"
import { error } from "jquery"

export default class Home extends React.Component {
    
    constructor() {
        super()
        this.state = {
            token :"",
            adminName: null,
            productsCount:0,
            customerCount : 0,
            transactionCount : 0,
            adminCount : 0,
        }
        if (localStorage.getItem("token")){
            this.state.token = localStorage.getItem("token")
        }else{
            window.location = "/login"
        }
    }
    headerConfig = () => {
        let header = {
            headers: {Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }
    getProduct = () => {
        let url = base_url + "/product"
        axios.get(url, this.headerConfig())
        .then(response=> {
            this.setState({productsCount : response.data.length})
        })
        .catch(error => {
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
    getCustomer = () => {
        let url = base_url + "/customer"
        axios.get(url, this.headerConfig())
        .then(response=> {
            this.setState({customerCount: response.data.length})
        })
        .catch(error => {
            if(error.response){
                if(error.response){
                    if(error.response.status){
                        window.alert(error.response.data.message)
                        this.props.history.push("/login")
                    }
                }else{
                    console.log(error);
                }
            }
        })
    }
    getTransaction = () => {
        let url = base_url + "/transaksi"
    }
    render() {

        return (
            <div>
                <Navbar />
                <div className="contaner mt-2">
                    <h3 className="my-2">
                        <strong>Welcome back, {this.state.adminName}</strong>
                    </h3>
                    <div className="row">
                        {/* product count */}
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-success">
                                    <h4 className="text-dark">
                                        <strong>Products Count</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.productsCount}</strong>
                                    </h1>
                                </div>
                            </div>
                        </div>
                        {/* customer count */}
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-info">
                                    <h4 className="text-dark">
                                        <strong>Customers Count</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.customersCount}</strong>
                                    </h1>
                                </div>
                            </div>
                        </div>
                         {/* transactions count */}
                         <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-warning">
                                    <h4 className="text-dark">
                                        <strong>Transactions Count</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.transactionsCount}</strong>
                                    </h1>
                                </div>
                            </div>
                        </div>
 
                        {/* admins count */}
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-2">
                            <div className="card">
                                <div className="card-body bg-danger">
                                    <h4 className="text-dark">
                                        <strong>Admins Count</strong>
                                    </h4>
                                    <h1 className="text-white">
                                        <strong>{this.state.adminsCount}</strong>
                                    </h1>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )

    }
}
