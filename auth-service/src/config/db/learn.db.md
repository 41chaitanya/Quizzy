### suryakumar sir <--

import mongoose from 'mongoose';
import CONFIG from './env.config.js';

class Database {
    member. function

  async connect() {
    try {
      const conn = await mongoose.connect(CONFIG.MONGO_URI);

      console.log(
        `MongoDB Connected: ${conn.connection.host}`
      );

      this.registerEvents();
    } catch (error) {
      console.error('Database connection failed:', error.message);
      process.exit(1);
    }
  }

  registerEvents() {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    mongoose.connection.on('error', (error) => {
      console.error('Mongoose error:', error.message);
    });
  }
}

export default new Database();


### khalid sir < ------------------------------->

import mongoose from "mongoose"
import config from "./config.js";

const connectDB = async ()=>{
    try {
        cosnt con =await mongoose.connect(config.MONGO_URI);

        console.log("DataBase Connected")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB





sury bhai ka code effective kb ha 


Connecting to multiple databases
Disconnecting gracefully
Seeding data
Running health checks
Handling reconnection logic






class DatabaseManager {
  constructor() {
   
   
     *   primary: Connection,
     *   analytics: Connection,
     *   logs: Connection
   
    this.connections = {};

    /**
     * Maximum reconnection attempts.
     */
    this.maxReconnectAttempts = 5;

    /**
     * Delay between reconnection attempts (milliseconds).
     */
    this.reconnectDelay = 5000;

    /**
     * Track reconnection attempts per database.
     */
    this.reconnectAttempts = {};
  }

  /**
   * Configuration for all databases.
   */


  getDatabaseConfigs() {
    return {
      primary: CONFIG.MONGO_URI,
      analytics: CONFIG.ANALYTICS_MONGO_URI,
      logs: CONFIG.LOGS_MONGO_URI,
    };
  }

  /**
   * Connect to all configured databases.
   */
  async connectAll() {
    const dbConfigs = this.getDatabaseConfigs();

    for (const [name, uri] of Object.entries(dbConfigs)) {
      if (!uri) continue; // Skip if URI not defined
      await this.connect(name, uri);
    }
  }

  /**
   * Connect to a single database.
   *
   * @param {string} name - Connection name
   * @param {string} uri - MongoDB URI
   */
  async connect(name, uri) {
    try {
      console.log(`Connecting to ${name} database...`);

      // createConnection() returns a separate connection.
      const connection = await mongoose.createConnection(uri).asPromise();

      // Store the connection.
      this.connections[name] = connection;

      // Initialize reconnect attempts.
      this.reconnectAttempts[name] = 0;

      console.log(
        `Connected to ${name}: ${connection.host}:${connection.port}/${connection.name}`
      );

      // Register event listeners.
      this.registerEvents(name, connection);

      return connection;
    } catch (error) {
      console.error(
        `Failed to connect to ${name}:`,
        error.message
      );

      // Try reconnecting.
      await this.handleReconnect(name, uri);

      throw error;
    }
  }

  /**
   * Register event listeners.
   */
  registerEvents(name, connection) {
    connection.on('connected', () => {
      console.log(`${name} database connected`);
    });

    connection.on('disconnected', async () => {
      console.log(`${name} database disconnected`);

      const uri = this.getDatabaseConfigs()[name];
      if (uri) {
        await this.handleReconnect(name, uri);
      }
    });

    connection.on('error', (error) => {
      console.error(
        `${name} database error:`,
        error.message
      );
    });
  }

  /**
   * Reconnect logic.
   */
  async handleReconnect(name, uri) {
    const attempts = this.reconnectAttempts[name] || 0;

    if (attempts >= this.maxReconnectAttempts) {
      console.error(
        `Max reconnection attempts reached for ${name}`
      );
      return;
    }

    this.reconnectAttempts[name] = attempts + 1;

    console.log(
      `Reconnecting to ${name} in ${this.reconnectDelay / 1000}s... ` +
      `(Attempt ${this.reconnectAttempts[name]}/${this.maxReconnectAttempts})`
    );

    await new Promise((resolve) =>
      setTimeout(resolve, this.reconnectDelay)
    );

    try {
      await this.connect(name, uri);
    } catch (error) {
      // Retry handled recursively
    }
  }

  /**
   * Get a connection by name.
   */
  getConnection(name = 'primary') {
    return this.connections[name];
  }

  /**
   * Check health of all databases.
   */
  async healthCheck() {
    const result = {};

    for (const [name, connection] of Object.entries(this.connections)) {
      try {
        // Ping the database.
        await connection.db.admin().ping();

        result[name] = {
          status: 'UP',
          host: connection.host,
          port: connection.port,
          dbName: connection.name,
          readyState: connection.readyState,
        };
      } catch (error) {
        result[name] = {
          status: 'DOWN',
          error: error.message,
        };
      }
    }

    return result;
  }

  /**
   * Disconnect all databases.
   */
  async disconnectAll() {
    for (const [name, connection] of Object.entries(this.connections)) {
      try {
        await connection.close();
        console.log(`${name} database disconnected successfully`);
      } catch (error) {
        console.error(
          `Error disconnecting ${name}:`,
          error.message
        );
      }
    }

    this.connections = {};
  }

 
  async seed(seedFunction) {
    try {
      const primaryConnection = this.getConnection('primary');

      if (!primaryConnection) {
        throw new Error('Primary database not connected');
      }

      await seedFunction(primaryConnection);

      console.log('Database seeding completed');
    } catch (error) {
      console.error('Database seeding failed:', error.message);
      throw error;
    }
  }
}

// Export singleton instance.
const databaseManager = new DatabaseManager();

export default databaseManager;