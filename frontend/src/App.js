import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { Authenticated } from "./components/Auth/Authenticated";
import { Login } from "./components/Auth/Login";
import { PublicRoute } from "./components/Auth/PublicRoute";
import { Register } from "./components/Auth/Register";
import { NavBar } from "./components/Navbar/NavBar";
import { TodoDetail } from "./components/Todo/TodoDetail";
import { TodoList } from "./components/Todo/TodoList";
import { AuthConsumer, AuthProvider } from "./context/JWTAuthContext";
import { MainPage } from "./pages/MainPage";
import { TodoProvider } from "./context/TodoIsOpenContext";
import { InvitePage } from "./pages/InvitePage";
import { MobileProvider } from "./context/IsMobileContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AuthConsumer>
            {(auth) =>
              !auth.isInitialized ? (
                <Flex
                  height="100vh"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="green.200"
                    color="green.500"
                    size="xl"
                  />
                </Flex>
              ) : (
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route path="/" element={<MainPage />}>
                    <Route
                      path="/"
                      element={
                        <Authenticated>
                          <MobileProvider>
                            <TodoProvider>
                              <TodoList />
                            </TodoProvider>
                          </MobileProvider>
                        </Authenticated>
                      }
                    >
                      <Route
                        path="todos/:todoId"
                        element={
                          <Authenticated>
                            <TodoDetail />
                          </Authenticated>
                        }
                      />
                    </Route>
                  </Route>

                  <Route
                    path="/inviteLink/:id"
                    element={
                      <Authenticated>
                        <InvitePage />
                      </Authenticated>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              )
            }
          </AuthConsumer>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
