module.exports = {
  apps: [
    {
      name: "econ-lms",
      script: "./.next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: process.env.NODE_ENV || "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=1024",
      },
      node_args:
        "--optimize_for_size --gc_interval=100 --max-old-space-size=1024",
      max_memory_restart: "900M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
