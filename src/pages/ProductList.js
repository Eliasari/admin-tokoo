import React from "react"
 
class ProductList extends React.Component{
    render(){
        return (
            <div className="col-lg-6 col-sm-12 p-2">
                <div className="card">
                    <div className="card-body row">
                        {/* menampilkan Gambar / cover */}
                        <div className="col-5">
                            <img src={this.props.fotoProduk} className="img"
                            height="200" width="200" alt={this.props.namaProduk} />
                        </div>
 
                        {/* menampilkan deskripsi */}
                        <div className="col-7">
                            <h5 className="text-info">
                                { this.props.namaProduk }
                            </h5>
                            <h6 className="text-danger">
                                Deskripsi: { this.props.deskripsiProduk}
                            </h6>
                            <h6 className="text-dark">
                                Harga: { this.props.hargaProduk}
                            </h6>
 
                            {/* button untuk mengedit */}
                            <button className="btn btn-sm btn-primary m-1"
                            onClick={this.props.onEdit}>
                                Edit
                            </button>
 
                            {/* button untuk menghapus */}
                            <button className="btn btn-sm btn-danger m-1"
                            onClick={this.props.onDrop}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ProductList;