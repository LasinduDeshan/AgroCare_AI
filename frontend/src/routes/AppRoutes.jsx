import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";

const ResultsHistory = lazy(() => import("../pages/ResultsHistory"));

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-2xl font-bold mb-2">404 - Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const AppRoutes = ({ user }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<ImageUploader user={user} />} />
      <Route path="/history" element={<ResultsHistory user={user} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes; 