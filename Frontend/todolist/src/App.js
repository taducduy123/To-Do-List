import React, {useState, useEffect} from "react"
import api from './api'
import {TaskCRUD} from "./components/TaskCRUD";


const App = () => {


    return (
        <>

            <TaskCRUD/>
            {/*<div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">*/}
            {/*    <div className="card shadow w-100" style={{maxWidth: 900}}>*/}
            {/*        <div className="card-header bg-primary text-white">*/}
            {/*            <h5 className="mb-0">To Do List</h5>*/}
            {/*        </div>*/}

            {/*        <div className="card-body">*/}
            {/*            /!* Search form *!/*/}
            {/*            <form className="container px-0 mb-3" action="/api/task-search" method="get">*/}
            {/*                <div className="input-group">*/}
            {/*                    <input type="text" className="form-control" placeholder="Search by name"*/}
            {/*                           name="keyword"/>*/}
            {/*                    <button type="submit" className="btn btn-primary">*/}
            {/*                        <i className="fas fa-search"></i>*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </form>*/}

            {/*            /!* Table *!/*/}
            {/*            <div className="table-responsive">*/}
            {/*                <table className="table align-middle mb-0 bg-white">*/}
            {/*                    <thead>*/}
            {/*                    <tr>*/}
            {/*                        <th className="bg-dark text-light">Task ID</th>*/}
            {/*                        <th className="bg-dark text-light">Description</th>*/}
            {/*                        <th className="bg-dark text-light">Done?</th>*/}
            {/*                    </tr>*/}
            {/*                    </thead>*/}
            {/*                    <tbody>*/}
            {/*                    /!* rows go here *!/*/}
            {/*                    </tbody>*/}
            {/*                </table>*/}
            {/*            </div>*/}

            {/*            /!* Create button *!/*/}
            {/*            <div className="d-flex justify-content-center mt-4">*/}
            {/*                <a href="#">*/}
            {/*                    <button type="button"*/}
            {/*                            className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm">*/}
            {/*                        + Create New Task*/}
            {/*                    </button>*/}
            {/*                </a>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </>
    );
};

export default App;
